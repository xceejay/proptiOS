const mysql_db = require("../../config/db.mysql");
const moment = require("moment");
const { customAlphabet } = require("nanoid");
var multer = require("multer");
var upload = multer();

const nanoid = customAlphabet(
  "123456789AbcDeFkLPzZQqRrMmNWwBEGgHhJSTtUuXx",
  32
);

const jwtMiddleware = require("../../middleware/jwt");
const acl = require("../../middleware/acl");

const PREFIX = "/properties";

const routes = (app) => {
  //add property to db

  app.post(
    PREFIX,
    jwtMiddleware,
    acl([
      "property_owner",
      "property_manager",
      "property_coordinator",
      "maintenance_worker",
    ]),
    async (req, res) => {
      const properties = req.body;
      const site_subscription_id = req.user.site_subscription_id;

      if (!Array.isArray(properties) || properties.length === 0) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: expected an array of property objects",
        });
      }

      // Validate each property object
      for (const property of properties) {
        const { property_name, property_type, uuid } = property;
        if (!property_name || !property_type || !uuid) {
          return res.status(400).json({
            status: "FAILED",
            description:
              "Invalid input: required fields are missing for one or more properties",
          });
        }
      }

      const connection = await mysql_db.getConnection();

      try {
        // Get subscription limits for both properties and units
        const [limitRows] = await connection.query(
          `SELECT resource_type, resource_limit 
           FROM subscription_limits 
           WHERE subscription_id = ? 
           AND resource_type IN ('property', 'unit')`,
          [site_subscription_id]
        );

        if (limitRows.length === 0) {
          return res.status(400).json({
            status: "FAILED",
            description: "Invalid subscription tier or limits not configured",
          });
        }

        const limits = limitRows.reduce((acc, row) => {
          acc[row.resource_type] = row.resource_limit;
          return acc;
        }, {});

        // Check existing properties count
        const [propertyCountRows] = await connection.query(
          `SELECT COUNT(*) as property_count 
           FROM properties 
           WHERE site_id = ? and deleted_at IS NULL`,
          [req.user.site_id]
        );

        // Validate property limit
        if (
          propertyCountRows[0].property_count + properties.length >
          limits.property
        ) {
          return res.status(400).json({
            status: "FAILED",
            description: `Property limit exceeded for the '${site_subscription_id}' subscription tier. Maximum allowed: ${limits.property}`,
          });
        }

        // Calculate total new units being added
        const totalNewUnits = properties.reduce(
          (sum, property) => sum + (property.units || 1),
          0
        );

        // Check existing units count - Using COALESCE to handle NULL
        const [unitCountRows] = await connection.query(
          `SELECT COALESCE(SUM(units), 0) AS total_units 
           FROM properties 
           WHERE site_id = ? and deleted_at IS NULL`,
          [req.user.site_id]
        );

        const currentUnits = parseInt(unitCountRows[0].total_units);

        // Debug logging
        console.log({
          currentUnits,
          totalNewUnits,
          unitLimit: limits.unit,
          wouldBeTotalUnits: currentUnits + totalNewUnits,
        });

        // Validate unit limit
        if (currentUnits + totalNewUnits > limits.unit) {
          return res.status(400).json({
            status: "FAILED",
            description: `Unit limit exceeded for the '${site_subscription_id}' subscription tier. Current units: ${currentUnits}, Attempting to add: ${totalNewUnits}, Maximum allowed: ${limits.unit}`,
          });
        }

        // Proceed with property insertion if all validations pass
        let stamp = moment().format("YYYY-MM-DD HH:mm:ss");
        await connection.beginTransaction();

        const insertedProperties = [];

        for (const property of properties) {
          const insertQuery = `
            INSERT INTO properties (
              uuid, property_name, units, property_email, property_tel_number, 
              country, property_address, description, property_image_url, 
              site_id, created_at, updated_at, status, property_type, 
              rent_amount, pm_user_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const values = [
            property.uuid,
            property.property_name,
            property.units || 1,
            property.property_email,
            property.property_tel_number || "",
            property.country || "GHA",
            property.property_address || "",
            property.description || "",
            property.property_image_url || "",
            req.user.site_id,
            stamp,
            stamp,
            "active",
            property.property_type,
            property.rent_amount || 0,
            req.user.id,
          ];

          const [result] = await connection.query(insertQuery, values);
          insertedProperties.push({
            id: result.insertId.toString(),
            uuid: property.uuid,
          });
        }

        await connection.commit();

        return res.status(201).json({
          status: "SUCCESS",
          description: `Successfully inserted ${properties.length} property(s)`,
          data: insertedProperties,
        });
      } catch (error) {
        await connection.rollback();
        console.error("Error inserting properties:", error);

        if (error.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            status: "FAILED",
            description:
              "Duplicate entry: one or more properties have already been registered with the same email or UUID",
          });
        }

        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to insert properties",
        });
      } finally {
        connection.release();
      }
    }
  );

  // Update properties
  app.put(
    PREFIX,
    jwtMiddleware,
    acl([
      "property_owner",
      "property_manager",
      "property_coordinator",
      "maintenance_worker",
    ]),
    async (req, res) => {
      const properties = req.body;
      const site_subscription_id = req.user.site_subscription_id;

      if (!Array.isArray(properties) || properties.length === 0) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: expected an array of property objects",
        });
      }

      // Validate each property object
      for (const property of properties) {
        const { property_name, property_type, uuid } = property;
        if (!property_name || !property_type || !uuid) {
          return res.status(400).json({
            status: "FAILED",
            description: "Invalid input: required fields are missing for one or more properties",
          });
        }
      }

      const connection = await mysql_db.getConnection();

      try {
        // Get subscription limits
        const [limitRows] = await connection.query(
          `SELECT resource_type, resource_limit 
           FROM subscription_limits 
           WHERE subscription_id = ? 
           AND resource_type IN ('property', 'unit')`,
          [site_subscription_id]
        );

        if (limitRows.length === 0) {
          return res.status(400).json({
            status: "FAILED",
            description: "Invalid subscription tier or limits not configured",
          });
        }

        const limits = limitRows.reduce((acc, row) => {
          acc[row.resource_type] = row.resource_limit;
          return acc;
        }, {});

        // Get existing properties data for validation
        const propertyUuids = properties.map(p => p.uuid);
        const [existingProperties] = await connection.query(
          `SELECT id, uuid, units 
           FROM properties 
           WHERE uuid IN (?) AND site_id = ? AND deleted_at IS NULL`,
          [propertyUuids, req.user.site_id]
        );

        // Check if all properties exist
        if (existingProperties.length !== properties.length) {
          return res.status(404).json({
            status: "FAILED",
            description: "One or more properties not found",
          });
        }

        // Create a map of existing units and IDs
        const existingPropsMap = existingProperties.reduce((acc, prop) => {
          acc[prop.uuid] = {
            units: prop.units,
            id: prop.id
          };
          return acc;
        }, {});

        // Calculate the total change in units
        let totalUnitsDelta = 0;
        for (const property of properties) {
          const newUnits = property.units || 1;
          const oldUnits = existingPropsMap[property.uuid].units;
          totalUnitsDelta += (newUnits - oldUnits);
        }

        // Get current total units
        const [unitCountRows] = await connection.query(
          `SELECT COALESCE(SUM(units), 0) AS total_units 
           FROM properties 
           WHERE site_id = ? AND deleted_at IS NULL`,
          [req.user.site_id]
        );

        const currentUnits = parseInt(unitCountRows[0].total_units);
        const projectedTotalUnits = currentUnits + totalUnitsDelta;

        // Debug logging
        console.log({
          currentUnits,
          totalUnitsDelta,
          projectedTotalUnits,
          unitLimit: limits.unit
        });

        // Validate unit limit
        if (projectedTotalUnits > limits.unit) {
          return res.status(400).json({
            status: "FAILED",
            description: `Unit limit exceeded for the '${site_subscription_id}' subscription tier. Current units: ${currentUnits}, Change in units: ${totalUnitsDelta}, Maximum allowed: ${limits.unit}`,
          });
        }

        // Proceed with property updates
        let stamp = moment().format("YYYY-MM-DD HH:mm:ss");
        await connection.beginTransaction();

        const updatedProperties = [];

        for (const property of properties) {
          const updateQuery = `
            UPDATE properties
            SET 
              property_name = ?,
              units = ?,
              property_email = ?,
              property_tel_number = ?,
              country = ?,
              property_address = ?,
              description = ?,
              property_image_url = ?,
              updated_at = ?,
              status = ?,
              property_type = ?,
              rent_amount = ?,
              pm_user_id = ?
            WHERE uuid = ? AND site_id = ? AND deleted_at IS NULL
          `;

          const values = [
            property.property_name,
            property.units || 1,
            property.property_email || "",
            property.property_tel_number || "",
            property.country || "GHA",
            property.property_address || "",
            property.description || "",
            property.property_image_url || "",
            stamp,
            "active",
            property.property_type,
            property.rent_amount || 0,
            req.user.id,
            property.uuid,
            req.user.site_id,
          ];

          await connection.query(updateQuery, values);
          
          updatedProperties.push({
            id: existingPropsMap[property.uuid].id.toString(),
            uuid: property.uuid
          });
        }

        await connection.commit();

        return res.status(200).json({
          status: "SUCCESS",
          description: `Successfully updated ${properties.length} property(s)`,
          data: updatedProperties
        });
      } catch (error) {
        await connection.rollback();
        console.error("Error updating properties:", error);

        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to update properties",
        });
      } finally {
        connection.release();
      }
    }
  );

  app.get(
    PREFIX + "/:property_id/all",
    jwtMiddleware,
    acl([
      "property_owner",
      "property_manager",
      "property_coordinator",
      "maintenance_worker",
    ]),
    async (req, res) => {
      const { property_id } = req.params;

      try {
        const selectQuery = `
      SELECT 
  properties.id AS property_id,
  properties.uuid AS property_uuid,
  properties.property_name AS property_name,
  properties.property_address AS property_address,
  properties.property_type AS property_type,
  properties.status AS status,
  properties.units AS property_units,
  properties.property_image_url AS property_image_url,
  properties.created_at AS property_created_at,
  properties.updated_at AS property_updated_at,

  pm_users.id AS pm_user_id,
  pm_users.name AS pm_user_name,
  pm_users.email AS pm_user_email,
  pm_users.tel_number AS pm_user_tel_number,

  units.id AS unit_id,
  units.floor_no AS unit_floor_no,
  units.name AS unit_name,
  units.lease_id AS unit_lease_id,
  units.bedrooms AS unit_bedrooms,
  units.description AS unit_description,
  units.furnished AS unit_furnished,
  units.bathrooms AS unit_bathrooms,
  units.common_area AS unit_common_area,
  units.rent_amount AS unit_monthly_rent,
  units.unit_image_url AS unit_image_url,
  units.tenant_id AS unit_tenant_id,

  tenants.id AS tenant_id,
  tenants.name AS tenant_name,
  tenants.email AS tenant_email,
  tenants.tel_number AS tenant_tel_number,
  tenants.address AS tenant_address,
  tenants.country AS tenant_country,
  tenants.status AS tenant_status,
  tenants.property_id AS tenant_property_id,

  leases.id AS lease_id,
  leases.title AS lease_title,
  leases.lease_type AS lease_type,
  leases.status AS lease_status,
  leases.start_date AS lease_start_date,
  leases.end_date AS lease_end_date,
  leases.unit_id AS lease_unit_id,
  leases.payment_frequency AS lease_payment_frequency,
  leases.tenant_id AS lease_tenant_id,
  leases.document_url AS lease_document_url,
  leases.property_id AS lease_property_id,

  maintenance_requests.id AS maintenance_request_id,
  maintenance_requests.uuid AS maintenance_request_uuid,
  maintenance_requests.media_type AS maintenance_media_type,
  maintenance_requests.media_url AS maintenance_media_url,
  maintenance_requests.request_owner AS maintenance_request_owner,
  maintenance_requests.created_at AS maintenance_request_created_at,
  maintenance_requests.description AS maintenance_request_description,
  maintenance_requests.title AS maintenance_request_title,
  maintenance_requests.tenant_id AS maintenance_request_tenant_id,
  maintenance_requests.internal_assignee_id AS maintenance_request_internal_assignee_id,
  maintenance_requests.external_assignee_id AS maintenance_request_external_assignee,
  maintenance_requests.status AS maintenance_request_status,
  maintenance_requests.unit_id AS maintenance_request_unit_id,
  maintenance_requests.requested_by AS maintenance_requested_by,
  
  -- Use CASE to determine the requester
  CASE 
    WHEN maintenance_requests.requested_by = 'tenant' THEN tenants.id
    WHEN maintenance_requests.requested_by = 'pm_user' THEN pm_users.id
  END AS requester_id,

  CASE 
    WHEN maintenance_requests.requested_by = 'tenant' THEN tenants.name
    WHEN maintenance_requests.requested_by = 'pm_user' THEN pm_users.name
  END AS requester_name

FROM 
  properties
LEFT JOIN pm_users ON pm_users.site_id = properties.site_id
LEFT JOIN units ON units.property_id = properties.id
LEFT JOIN tenants ON tenants.property_id = properties.id
LEFT JOIN leases ON leases.property_id = properties.id 
LEFT JOIN maintenance_requests ON maintenance_requests.property_id = properties.id
LEFT JOIN pm_users AS internal_assignee ON maintenance_requests.internal_assignee_id = internal_assignee.id
WHERE 
  properties.id = ? AND properties.site_id = ?;
  `;
        const [results] = await mysql_db.execute(selectQuery, [
          property_id,
          req.user.site_id,
        ]);

        if (results.length === 0) {
          return res.status(200).json({
            data: {},
            status: "NO_RES",
            description: "Property not found",
          });
        }

        const propertyInfo = {};
        const maintenanceRequests = new Map();
        const units = new Map();
        const tenants = new Map();
        const leases = new Map();

        results.forEach((row) => {
          // Populate property info
          if (row.property_id) {
            propertyInfo.id = row.property_id;
            propertyInfo.uuid = row.property_uuid;
            propertyInfo.name = row.property_name;
            propertyInfo.address = row.property_address;
            propertyInfo.status = row.property_status;
            propertyInfo.type = row.property_type;
            propertyInfo.allocated_units = row.property_units;
            propertyInfo.property_image_url = row.property_image_url;
            propertyInfo.created_at = row.property_created_at;
            propertyInfo.updated_at = row.property_updated_at;

            propertyInfo.property_manager = {
              id: row.pm_user_id,
              name: row.pm_user_name,
              email: row.pm_user_email,
              tel_number: row.property_tel_number,
            };
          }

          //Collect unique units
          if (row.unit_id) {
            units.set(row.unit_id, {
              id: row.unit_id,
              floor_no: row.unit_floor_no,
              name: row.unit_name,
              bedrooms: row.unit_bedrooms,
              lease_id: row.unit_lease_id,
              description: row.unit_description,
              tenant_id: row.unit_tenant_id,
              common_area: row.unit_common_area,
              bathrooms: row.unit_bathrooms,
              furnished: row.unit_furnished,
              monthly_rent: row.unit_monthly_rent,
              unit_image_url: row.unit_image_url,
            });
          }

          // Collect unique leases
          if (row.lease_id) {
            leases.set(row.lease_id, {
              id: row.lease_id,
              title: row.lease_title,
              type: row.lease_type,
              status: row.lease_status,
              start_date: row.lease_start_date,
              end_date: row.lease_end_date,
              unit_id: row.lease_unit_id,
              payment_frequency: row.lease_payment_frequency,
              tenant_id: row.lease_tenant_id,
              unit_id: row.lease_unit_id,
              document_url: row.lease_document_url,
              property_id: row.lease_property_id,
            });
          }

          // Collect unique tenants
          if (row.tenant_id) {
            tenants.set(row.tenant_id, {
              id: row.tenant_id,
              name: row.tenant_name,
              email: row.tenant_email,
              tel_number: row.tenant_tel_number,
              property_id: row.tenant_property_id,
              address: row.tenant_address,
              country: row.tenant_country,
              status: row.tenant_status,
            });
          }

          // Collect unique maintenance requests
          if (row.maintenance_request_id) {
            maintenanceRequests.set(row.maintenance_request_id, {
              id: row.maintenance_request_id,
              uuid: row.maintenance_request_uuid,
              title: row.maintenance_request_title,
              description: row.maintenance_request_description,
              tenant_id: row.maintenance_request_tenant_id,
              internal_assignee: {
                id: row.maintenance_request_internal_assignee_id,
                name: row.internal_assignee_name,
              },
              external_assignee: row.maintenance_request_external_assignee,
              status: row.maintenance_request_status,
              unit_id: row.maintenance_request_unit_id,
              media_type: row.maintenance_media_type,
              media_url: row.maintenance_media_url,
              request_owner: row.maintenance_request_owner,
              created_at: row.maintenance_request_created_at,

              // Include requested_by value
              requested_by: row.requested_by,

              // Determine requester based on the 'requested_by' column
              requester: {
                id:
                  row.requested_by === "tenant"
                    ? row.tenant_id
                    : row.pm_user_id,
                name:
                  row.requested_by === "tenant"
                    ? row.tenant_name
                    : row.pm_user_name,
              },
            });
          }
        });

        // Determine response based on user type
        if (
          req.user.user_type === "property_manager" ||
          req.user.user_type === "property_coordinator" ||
          req.user.user_type === "property_owner"
        ) {
          return res.status(200).json({
            status: "SUCCESS",
            data: {
              ...propertyInfo,
              units: Array.from(units.values()),
              tenants: Array.from(tenants.values()),
              leases: Array.from(leases.values()),
              maintenance_requests: Array.from(maintenanceRequests.values()),
            },
            description: "Property Details Fetched Successfully",
          });
        } else {
          // For other user types, only return maintenance requests and units
          return res.status(200).json({
            status: "SUCCESS",
            data: {
              ...propertyInfo,
              units: Array.from(units.values()),
              tenants: Array.from(tenants.values()),
              maintenance_requests: Array.from(maintenanceRequests.values()),
            },
            description: "Property Details Fetched Successfully",
          });
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch property",
        });
      }
    }
  );

  app.get(
    PREFIX + "/:property_id/expenses",
    jwtMiddleware,
    acl([
      "property_owner",
      "property_manager",
      "property_coordinator",
      "maintenance_worker",
    ]),

    async (req, res) => {
      const user = req.user;
      const property_id = parseInt(req.params.property_id);
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const limit = Math.max(parseInt(req.query.limit) || 10, 1);
      const offset = (page - 1) * limit;

      const totalTransactionsQuery =
        "SELECT COUNT(*) AS total FROM transactions WHERE property_id = ? AND payment_type != 'rent' AND pm_user_id = ? AND site_id = ?";
      const transactionsQuery =
        "SELECT transactions.*, tenants.name as tenant_name, properties.property_name FROM transactions INNER JOIN tenants ON transactions.tenant_id = tenants.id INNER JOIN properties ON transactions.property_id = properties.id WHERE property_id = ? AND payment_type != 'rent' AND pm_user_id = ? AND transactions.site_id = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?";

      try {
        const [totalResults] = await mysql_db.execute(totalTransactionsQuery, [
          property_id,
          user.id,
          user.site_id,
        ]);
        const totalTransactions = totalResults[0]?.total || 0;
        const totalPages = Math.ceil(totalTransactions / limit);

        const [transactionResults] = await mysql_db.execute(transactionsQuery, [
          property_id,
          user.id,
          user.site_id,
          limit,
          offset,
        ]);

        return res.status(200).json({
          status: "SUCCESS",
          data: {
            page,
            limit,
            totalTransactions,
            totalPages,
            items: transactionResults,
          },
          description: "Property Expenses retrieved Successfully",
        });
      } catch (error) {
        console.error("Error fetching transactions:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch transactions",
        });
      }
    }
  );

  app.get(
    PREFIX + "/:property_id/units",
    jwtMiddleware,
    acl([
      "property_owner",
      "property_manager",
      "property_coordinator",
      "maintenance_worker",
    ]),

    async (req, res) => {
      const user = req.user;
      const property_id = parseInt(req.params.property_id);
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const limit = Math.max(parseInt(req.query.limit) || 10, 1);
      const offset = (page - 1) * limit;

      const totalUnitsQuery =
        "SELECT COUNT(*) AS total FROM units INNER JOIN properties ON properties.id = units.property_id WHERE property_id = ? AND properties.pm_user_id = ? AND properties.site_id = ?";
      const unitsQuery =
        "SELECT units.*, tenants.name as tenant_name, properties.property_name FROM units INNER JOIN tenants ON units.tenant_id = tenants.id INNER JOIN properties ON units.property_id = properties.id WHERE property_id = ? AND properties.pm_user_id = ? AND properties.site_id = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?";

      try {
        const [totalResults] = await mysql_db.execute(totalUnitsQuery, [
          property_id,
          user.id,
          user.site_id,
        ]);
        const totalUnits = totalResults[0]?.total || 0;
        const totalPages = Math.ceil(totalUnits / limit);

        const [unitResults] = await mysql_db.execute(unitsQuery, [
          property_id,
          user.id,
          user.site_id,
          limit,
          offset,
        ]);

        return res.status(200).json({
          status: "SUCCESS",
          data: {
            page,
            limit,
            totalUnits,
            totalPages,
            items: unitResults,
          },
          description: "Property Units retrieved Successfully",
        });
      } catch (error) {
        console.error("Error fetching units:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch units",
        });
      }
    }
  );

  // get all properties along with all its data

  app.get(
    PREFIX + "/all",
    jwtMiddleware,
    acl([
      "property_owner",
      "property_manager",
      "property_coordinator",
      "maintenance_worker",
    ]),
    async (req, res) => {
      try {
        const selectQuery = `
          SELECT 
              properties.id AS property_id,
              properties.property_name AS property_name,
              properties.property_address AS property_address,
              properties.property_type AS property_type,
              properties.status AS status,
              properties.units AS property_units,
              properties.property_image_url AS property_image_url,
              properties.created_at AS property_created_at,
              properties.updated_at AS property_updated_at,
      
              pm_users.id AS pm_user_id,
              pm_users.name AS pm_user_name,
              pm_users.email AS pm_user_email,
              pm_users.tel_number AS pm_user_tel_number,
      
              units.id AS unit_id,
              units.floor_no AS unit_floor_no,
              units.name AS unit_name,
              units.lease_id AS unit_lease_id,
              units.bedrooms AS unit_bedrooms,
              units.description AS unit_description,
              units.furnished AS unit_furnished,
              units.bathrooms AS unit_bathrooms,
              units.common_area AS unit_common_area,
              units.rent_amount AS unit_monthly_rent,
              units.unit_image_url AS unit_image_url,
              units.tenant_id AS unit_tenant_id,
      
              tenants.id AS tenant_id,
              tenants.name AS tenant_name,
              tenants.email AS tenant_email,
              tenants.tel_number AS tenant_tel_number,
              tenants.address AS tenant_address,
              tenants.country AS tenant_country,
              tenants.status AS tenant_status,
              tenants.property_id AS tenant_property_id,
      
              leases.id AS lease_id,
              leases.title AS lease_title,
              leases.lease_type AS lease_type,
              leases.start_date AS lease_start_date,
              leases.unit_id AS lease_unit_id,
              leases.payment_frequency AS lease_payment_frequency,
              leases.tenant_id AS lease_tenant_id,
              leases.document_url AS lease_document_url,
              leases.property_id AS lease_property_id,
      
              maintenance_requests.id AS maintenance_request_id,
              maintenance_requests.uuid AS maintenance_request_uuid,
              maintenance_requests.media_type AS maintenance_media_type,
              maintenance_requests.media_url AS maintenance_media_url,
              maintenance_requests.request_owner AS maintenance_request_owner,
              maintenance_requests.created_at AS maintenance_request_created_at,
              maintenance_requests.description AS maintenance_request_description,
              maintenance_requests.title AS maintenance_request_title,
              maintenance_requests.tenant_id AS maintenance_request_tenant_id,
              maintenance_requests.unit_id AS maintenance_request_unit_id 
          FROM 
              properties
          LEFT JOIN pm_users ON pm_users.site_id = properties.site_id
          LEFT JOIN units ON units.property_id = properties.id
          LEFT JOIN tenants ON tenants.property_id = properties.id
          LEFT JOIN leases ON leases.property_id = properties.id 
          LEFT JOIN maintenance_requests ON maintenance_requests.property_id = properties.id
          WHERE 
              properties.site_id = ?;
      `;
        const [results] = await mysql_db.execute(selectQuery, [
          req.user.site_id,
        ]);

        if (results.length === 0) {
          return res.status(200).json({
            data: [],
            status: "NO_RES",
            description: "No properties found",
          });
        }

        const propertiesMap = new Map();

        results.forEach((row) => {
          if (!propertiesMap.has(row.property_id)) {
            propertiesMap.set(row.property_id, {
              id: row.property_id,
              name: row.property_name,
              address: row.property_address,
              status: row.property_status,
              type: row.property_type,
              units: [],
              property_image_url: row.property_image_url,
              created_at: row.property_created_at,
              updated_at: row.property_updated_at,
              property_manager: {
                id: row.pm_user_id,
                name: row.pm_user_name,
                email: row.pm_user_email,
                tel_number: row.pm_user_tel_number,
              },
              tenants: [],
              leases: [],
              maintenance_requests: [],
            });
          }

          const property = propertiesMap.get(row.property_id);

          // Collect unique units
          if (row.unit_id) {
            property.units.push({
              id: row.unit_id,
              floor_no: row.unit_floor_no,
              name: row.unit_name,
              bedrooms: row.unit_bedrooms,
              lease_id: row.unit_lease_id,
              description: row.unit_description,
              tenant_id: row.unit_tenant_id,
              common_area: row.unit_common_area,
              bathrooms: row.unit_bathrooms,
              furnished: row.unit_furnished,
              monthly_rent: row.unit_monthly_rent,
              unit_image_url: row.unit_image_url,
            });
          }

          // Collect unique tenants
          if (row.tenant_id) {
            property.tenants.push({
              id: row.tenant_id,
              name: row.tenant_name,
              email: row.tenant_email,
              tel_number: row.tenant_tel_number,
              property_id: row.tenant_property_id,
              address: row.tenant_address,
              country: row.tenant_country,
              status: row.tenant_status,
            });
          }

          // Collect unique leases
          if (row.lease_id) {
            property.leases.push({
              id: row.lease_id,
              title: row.lease_title,
              type: row.lease_type,
              start_date: row.lease_start_date,
              unit_id: row.lease_unit_id,
              payment_frequency: row.lease_payment_frequency,
              tenant_id: row.lease_tenant_id,
              document_url: row.lease_document_url,
              property_id: row.lease_property_id,
            });
          }

          // Collect unique maintenance requests
          if (row.maintenance_request_id) {
            property.maintenance_requests.push({
              id: row.maintenance_request_id,
              uuid: row.maintenance_request_uuid,
              title: row.maintenance_request_title,
              description: row.maintenance_request_description,
              tenant_id: row.maintenance_request_tenant_id,
              unit_id: row.maintenance_request_unit_id,
              media_type: row.maintenance_media_type,
              media_url: row.maintenance_media_url,
              request_owner: row.maintenance_request_owner,
              created_at: row.maintenance_request_created_at,
            });
          }
        });

        return res.status(200).json({
          status: "SUCCESS",
          data: Array.from(propertiesMap.values()),
          description: "Properties retrieved successfully",
        });
      } catch (error) {
        console.error("Error fetching properties:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch properties",
        });
      }
    }
  );

  app.get(
    PREFIX + "/:id/overview",
    jwtMiddleware,
    acl([
      "property_owner",
      "property_manager",
      "property_coordinator",
      "maintenance_worker",
    ]),
    async (req, res) => {
      const property_id = req.params.id;
      try {
        const [
          [
            total_tenants,
            total_units,
            total_leases,
            total_maintenance_requests,
            units_vacant,
            total_active_lease,
            total_inactive_lease,
          ],
        ] = await mysql_db.execute(
          `
            SELECT 
              (SELECT COUNT(*) FROM tenants WHERE property_id = ? AND deleted_at IS NULL) AS total_tenants,
              (SELECT COUNT(*) FROM units WHERE property_id = ? AND deleted_at IS NULL) AS total_units,
              (SELECT COUNT(*) FROM leases WHERE property_id = ? AND deleted_at IS NULL) AS total_leases,
              (SELECT COUNT(*) FROM maintenance_requests WHERE property_id = ? AND deleted_at IS NULL) AS total_maintenance_requests,
              (SELECT COUNT(*) FROM units WHERE property_id = ? AND deleted_at IS NULL AND status = 'vacant') AS units_vacant,
              (SELECT COUNT(*) FROM leases WHERE property_id = ? AND deleted_at IS NULL AND status = 'active') AS total_active_lease,
              (SELECT COUNT(*) FROM leases WHERE property_id = ? AND deleted_at IS NULL AND status = 'inactive') AS total_inactive_lease
            FROM properties
            WHERE id = ? AND deleted_at IS NULL
          `,
          [
            property_id,
            property_id,
            property_id,
            property_id,
            property_id,
            property_id,
            property_id,
          ]
        );

        return res.status(200).json({
          status: "SUCCESS",
          data: {
            total_tenants,
            total_units,
            total_leases,
            total_maintenance_requests,
            units_vacant,
            total_active_lease,
            total_inactive_lease,
          },
          description: "Overview retrieved successfully",
        });
      } catch (error) {
        console.error("Error fetching overview:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch overview",
        });
      }
    }
  );

  app.get(
    PREFIX,
    jwtMiddleware,
    acl([
      "property_owner",
      "property_manager",
      "property_coordinator",
      "maintenance_worker",
    ]),
    async (req, res) => {
      const site_id = req.user.site_id;
      try {
        const today = new Date();
        const nextMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          1
        );

        let query = `
          SELECT 
            p.*,
            (SELECT COUNT(*) FROM tenants WHERE property_id = p.id AND deleted_at IS NULL) AS total_tenants,
            (SELECT COUNT(*) FROM units WHERE property_id = p.id AND deleted_at IS NULL) AS total_units,
            (SELECT COUNT(*) FROM leases WHERE property_id = p.id AND deleted_at IS NULL) AS total_leases,
            (SELECT COUNT(*) FROM maintenance_requests WHERE property_id = p.id AND deleted_at IS NULL) AS total_maintenance_requests,
            (SELECT COUNT(*) FROM maintenance_requests WHERE property_id = p.id AND deleted_at IS NULL and status = 'pending' ) AS pending_maintenance_requests,
            (SELECT COUNT(*) FROM units WHERE property_id = p.id AND deleted_at IS NULL AND status = 'vacant') AS units_vacant,
            (SELECT COUNT(*) FROM leases WHERE property_id = p.id AND deleted_at IS NULL AND end_date >= ? AND end_date < ?) AS leases_expiring_soon,
            (SELECT COUNT(*) FROM tenants WHERE property_id = p.id AND deleted_at IS NULL AND status = 'active') AS active_tenants
          FROM properties AS p
          WHERE p.site_id = ?
        `;

        const [results] = await mysql_db.execute(query, [
          nextMonth,
          new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 1),
          site_id,
        ]);

        return res.status(200).json({
          status: "SUCCESS",
          data: results,
          description: "Properties retrieved successfully",
        });
      } catch (error) {
        console.error("Error fetching sites:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch properties",
        });
      }
    }
  );

  app.post(
    PREFIX + "/units",
    jwtMiddleware,
    acl([
      "property_owner",
      "property_manager",
      "property_coordinator",
      "maintenance_worker",
    ]),

    async (req, res) => {
      const user = req.user;
      const units = req.body || req.body.units; // Assume the units are sent in the request body

      if (!Array.isArray(units) || units.length === 0) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: units should be a non-empty array",
        });
      }

      let connection;

      try {
        // Create a connection to the database
        connection = await mysql_db.getConnection(); // Get a connection from the pool

        // Start a transaction
        await connection.beginTransaction();

        const insertedUnits = []; // Array to store the inserted units

        const insertPromises = units.map(async (unit) => {
          const checkPropertyQuery = `
            SELECT 1 FROM properties
            WHERE id = ? AND site_id = ?
          `;

          const insertUnitQuery = `
            INSERT INTO units (uuid, name, description, floor_no, bedrooms, furnished, common_area, bathrooms, property_id, rent_amount, rent_amount_currency, tenant_id, unit_image_url, site_id)
            VALUES ( ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          // const updateTenantQuery = `
          //   UPDATE tenants
          //   SET unit_id = ?
          //   WHERE id = ? AND site_id = ?
          // `;

          const [rows] = await connection.query(checkPropertyQuery, [
            unit.property_id,
            user.site_id,
          ]);

          if (rows.length > 0) {
            const [result] = await connection.query(insertUnitQuery, [
              unit.uuid || null,
              unit.name || null,
              unit.description || null,
              unit.floor_no || null,
              unit.bedrooms || null,
              unit.furnished || null,
              unit.common_area || null,
              unit.bathrooms || null,
              unit.property_id || null,
              unit.rent_amount || 0,
              unit.rent_amount_currency || "USD",
              unit.tenant_id || null,
              unit.unit_image_url || null,
              user.site_id || null,
            ]);

            insertedUnits.push({
              ...unit,
              uuid: unit.uuid,
              id: result.insertId.toString(),
              tenant_id: unit.tenant_id,
            });

            // Update the tenant's unit_id if tenant_id exists
            // if (unit.tenant_id) {
            //   await connection.query(updateTenantQuery, [
            //     result.insertId, // The inserted unit's ID
            //     unit.tenant_id, // The tenant's ID to be updated
            //     user.site_id, // Ensure the update is within the correct site
            //   ]);
            // }
          } else {
            throw new Error(
              `Property with ID ${unit.property_id} does not exist or does not match the site_id`
            );
          }
        });

        // Execute all insert promises
        await Promise.all(insertPromises);

        // Commit the transaction
        await connection.commit();

        return res.status(200).json({
          status: "SUCCESS",
          description: "Successfully added units",
          data: insertedUnits, // Return the inserted units
        });
      } catch (error) {
        if (connection) {
          // Rollback the transaction in case of an error
          await connection.rollback();
        }

        console.error("Error inserting units:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to add units",
        });
      } finally {
        if (connection) {
          // Close the connection
          await connection.release();
        }
      }
    }
  );
  app.put(
    PREFIX + "/units",
    jwtMiddleware,
    acl([
      "property_owner",
      "property_manager",
      "property_coordinator",
      "maintenance_worker",
    ]),

    async (req, res) => {
      const units = req.body;

      console.log(units);

      if (!Array.isArray(units) || units.length === 0) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: expected an array of unit objects",
        });
      }

      for (const unit of units) {
        const { name, property_id } = unit;
        if (!name || !property_id) {
          return res.status(400).json({
            status: "FAILED",
            description:
              "Invalid input: required fields are missing for one or more units",
          });
        }
      }

      let stamp = moment().format("YYYY-MM-DD HH:mm:ss");

      const connection = await mysql_db.getConnection();

      try {
        await connection.beginTransaction();

        const updatedUnits = [];

        for (const unit of units) {
          // If there is a tenant_id, handle tenant-unit changes

          // Update unit data
          const updateUnitQuery = `
            UPDATE units
            SET 
                description = ?, 
                floor_no = ?, 
                bedrooms = ?, 
                furnished = ?, 
                common_area = ?, 
                bathrooms = ?, 
                property_id = ?, 
                updated_at = ?, 
                rent_amount = ?, 
                rent_amount_currency = ?, 
                tenant_id = ?, 
                unit_image_url = ?, 
                site_id = ?, 
                tenancy_start_date = ?, 
                tenancy_end_date = ?, 
                name = ?, 
                lease_id = ?
            WHERE id = ? AND site_id = ?
          `;

          const updateValues = [
            unit.description || null,
            unit.floor_no || 1,
            unit.bedrooms || 1,
            unit.furnished || 0,
            unit.common_area || 1,
            unit.bathrooms || 1,
            unit.property_id,
            stamp,
            unit.rent_amount || null,
            unit.rent_amount_currency || null,
            unit.tenant_id || null,
            unit.unit_image_url || null,
            req.user.site_id,
            unit.tenancy_start_date || null,
            unit.tenancy_end_date || null,
            unit.name,
            unit.lease_id || null,
            unit.id,
            req.user.site_id,
          ];

          const [result] = await connection.query(
            updateUnitQuery,
            updateValues
          );

          if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({
              status: "FAILED",
              description: `Unit with ID ${unit.id} not found`,
            });
          }

          updatedUnits.push({
            id: unit.id,
            name: unit.name,
            rent_amount: unit.rent_amount,
          });
        }

        await connection.commit();

        return res.status(200).json({
          status: "SUCCESS",
          description: `Successfully updated ${units.length} unit(s)`,
          data: updatedUnits,
        });
      } catch (error) {
        await connection.rollback();
        console.error("Error updating units:", error);

        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to update units",
        });
      } finally {
        connection.release();
      }
    }
  );

  app.post(
    PREFIX + "/maintenance-requests",
    jwtMiddleware,
    acl([
      "property_owner",
      "property_manager",
      "property_coordinator",
      "maintenance_worker",
    ]),

    upload.single("request_media"),
    async (req, res) => {
      const user = req.user;
      const requests = req.body || req.body.requests; // Assume the requests are sent in the request body

      if (!Array.isArray(requests) || requests.length === 0) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: requests should be a non-empty array",
        });
      }

      let connection;

      try {
        // Create a connection to the database
        connection = await mysql_db.getConnection(); // Get a connection from the pool

        // Start a transaction
        await connection.beginTransaction();

        const insertedRequests = []; // Array to store the inserted requests

        const insertPromises = requests.map(async (request) => {
          const checkPropertyQuery = `SELECT 1 FROM properties WHERE id = ? AND site_id = ?`;

          const insertRequestQuery = `INSERT INTO maintenance_requests (uuid, media_type, media_url, request_owner, unit_id, property_id, title, description, pm_user_id, site_id, tenant_id)
          VALUES ( ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

          const [rows] = await connection.query(checkPropertyQuery, [
            request.property_id,
            user.site_id,
          ]);

          if (rows.length > 0) {
            const [result] = await connection.query(insertRequestQuery, [
              request.uuid || null,
              request.media_type || null,
              request.media_url || null,
              request.request_owner || null,
              request.unit_id || null,
              request.property_id || null,
              request.title || null,
              request.description || null,
              request.pm_user_id || null,
              user.site_id || null,
              request.tenant_id || null,
            ]);

            insertedRequests.push({
              ...request,
              uuid: request.uuid,
              id: result.insertId.toString(),
            });
          } else {
            throw new Error(
              `Property with ID ${request.property_id} does not exist or does not match the site_id`
            );
          }
        });

        // Execute all insert promises
        await Promise.all(insertPromises);

        // Commit the transaction
        await connection.commit();

        return res.status(200).json({
          status: "SUCCESS",
          description: "Successfully inserted maintenance requests",
          data: insertedRequests, // Return the inserted requests
        });
      } catch (error) {
        if (connection) {
          // Rollback the transaction in case of an error
          await connection.rollback();
        }

        console.error("Error inserting maintenance requests:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to add maintenance requests",
        });
      } finally {
        if (connection) {
          // Close the connection
          await connection.release();
        }
      }
    }
  );


// Delete Units Endpoint
app.delete(
  '/units',
  jwtMiddleware,
  acl(["property_owner", "property_manager", "property_coordinator"]),
  async (req, res) => {
    const unitUuids = req.body.uuids;
    const site_id = req.user.site_id;

    if (!Array.isArray(unitUuids) || unitUuids.length === 0) {
      return res.status(400).json({
        status: "FAILED",
        description: "Invalid input: expected an array of unit UUIDs"
      });
    }

    const connection = await mysql_db.getConnection();

    try {
      await connection.beginTransaction();

      // Verify units exist and belong to the site
      const [existingUnits] = await connection.query(
        `SELECT id, uuid FROM units 
         WHERE uuid IN (?) AND site_id = ? AND deleted_at IS NULL`,
        [unitUuids, site_id]
      );

      if (existingUnits.length !== unitUuids.length) {
        return res.status(404).json({
          status: "FAILED",
          description: "One or more units not found or already deleted"
        });
      }

      // Check if any units have active leases
      const [activeLeases] = await connection.query(
        `SELECT u.uuid 
         FROM units u
         JOIN leases l ON u.id = l.unit_id
         WHERE u.uuid IN (?) 
         AND u.site_id = ?
         AND l.deleted_at IS NULL`,
        [unitUuids, site_id]
      );

      if (activeLeases.length > 0) {
        return res.status(400).json({
          status: "FAILED",
          description: "Cannot delete units with active leases"
        });
      }

      const stamp = moment().format("YYYY-MM-DD HH:mm:ss");

      // Soft delete units
      await connection.query(
        `UPDATE units 
         SET deleted_at = ? 
         WHERE uuid IN (?) AND site_id = ?`,
        [stamp, unitUuids, site_id]
      );

      await connection.commit();

      return res.status(200).json({
        status: "SUCCESS",
        description: `Successfully deleted ${unitUuids.length} unit(s)`
      });

    } catch (error) {
      await connection.rollback();
      console.error("Error deleting units:", error);
      
      return res.status(500).json({
        status: "FAILED",
        description: "Server Error: Failed to delete units"
      });
    } finally {
      connection.release();
    }
  }
);












};
module.exports = {
  routes,
};
