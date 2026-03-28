const mysql_db = require("../../config/db.mysql");
const moment = require("moment");
const uuid = require("uuid-random");
const { trim } = require("../../services/utilities");
const jwtMiddleware = require("../../middleware/jwt");
const acl = require("../../middleware/acl");
const { emailActivation } = require("../emailers/core");

const PREFIX = "/tenants";

const routes = (app) => {
  app.put(
    PREFIX + "/:id",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const tenant_id = req.params.id;
      const { name, address, tel_number, country } = req.body;

      if (!name || !address || !tel_number || !country) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: required fields are missing",
        });
      }

      try {
        const updateQuery =
          "UPDATE tenants SET name = ?, address = ?, tel_number = ?, country = ?, updated_at = NOW() WHERE id = ?";
        const [result] = await mysql_db.execute(updateQuery, [
          name,
          address,
          tel_number,
          country,
          tenant_id,
        ]);

        if (result.affectedRows === 0) {
          return res.status(200).json({
            data: [],
            status: "NO_RES",
            description: "Tenant not found",
          });
        }

        return res.status(200).json({
          status: "SUCCESS",
          description: "Successfully updated the tenant",
        });
      } catch (error) {
        console.error("Error updating tenant:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to update tenant",
        });
      }
    }
  );

  // add tenant to db
  app.post(
    PREFIX,
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const tenants = req.body;

      console.log(tenants);

      if (!Array.isArray(tenants) || tenants.length === 0) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: expected an array of tenant objects",
        });
      }

      // Validate each tenant object
      for (const tenant of tenants) {
        const { name, email } = tenant;
        if (!name || !email) {
          return res.status(400).json({
            status: "FAILED",
            description:
              "Invalid input: required fields are missing for one or more tenants",
          });
        }
      }

      let stamp = moment().format("YYYY-MM-DD HH:mm:ss");

      const connection = await mysql_db.getConnection(); // Get a connection from the pool

      try {
        await connection.beginTransaction(); // Start the transaction

        const insertedTenants = []; // Array to store the inserted tenant's IDs and emails

        for (const tenant of tenants) {
          const uuidValue = uuid(); // Generate a new UUID for each tenant
          const insertQuery = `
            INSERT INTO tenants (
              uuid, name, email, tel_number, password, country, address, property_id, site_id, created_at, updated_at, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const values = [
            uuidValue,
            tenant.name,
            tenant.email,
            tenant.tel_number || "", // Set to empty string if not provided
            uuidValue, // Temporarily setting UUID as password
            tenant.country || "GHA", // Default to 'GHA' if not provided
            tenant.address || "", // Set to empty string if not provided
            tenant.property_id || null,
            req.user.site_id,
            stamp,
            stamp,
            "inactive", // Default status to 'inactive'
          ];

          const [result] = await connection.query(insertQuery, values); // Insert each tenant one by one

          // Add the insertId and email to the insertedTenants array
          insertedTenants.push({
            id: result.insertId.toString(),
            email: tenant.email,
            units: tenant.units, // Store the array of units
          });
        }

        await connection.commit(); // Commit the transaction if all inserts are successful

        // Now update the units table for each tenant and their corresponding units
        for (const tenant of insertedTenants) {
          if (Array.isArray(tenant.units) && tenant.units.length > 0) {
            for (const unitId of tenant.units) {
              console.log("Assigning tenant", tenant.id, "to unit", unitId);

              const updateUnitQuery = `
                UPDATE units
                SET tenant_id = ?
                WHERE id = ?
              `;
              const updateValues = [tenant.id, unitId];
              await connection.query(updateUnitQuery, updateValues);
            }
          }
        }

        return res.status(201).json({
          status: "SUCCESS",
          description: `Successfully inserted ${tenants.length} tenant(s)`,
          data: insertedTenants, // Return the array of inserted tenants' IDs and emails
        });
      } catch (error) {
        await connection.rollback(); // Rollback the transaction in case of error
        console.error("Error inserting tenants:", error);

        // Check for specific MySQL error codes
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            status: "FAILED",
            description:
              "Duplicate entry: one or more tenants have already been registered with the same email or UUID",
          });
        }

        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to insert tenants",
        });
      } finally {
        connection.release(); // Release the connection back to the pool
      }
    }
  );
  // modify

  app.put(
    PREFIX,
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const tenants = req.body;

      console.log(tenants);

      if (!Array.isArray(tenants) || tenants.length === 0) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: expected an array of tenant objects",
        });
      }

      for (const tenant of tenants) {
        const { name, email } = tenant;
        if (!name || !email) {
          return res.status(400).json({
            status: "FAILED",
            description:
              "Invalid input: required fields are missing for one or more tenants",
          });
        }
      }

      let stamp = moment().format("YYYY-MM-DD HH:mm:ss");

      const connection = await mysql_db.getConnection();

      try {
        await connection.beginTransaction();

        const updatedTenants = [];

        for (const tenant of tenants) {
          const updateQuery = `
                  UPDATE tenants 
                  SET 
                      name = ?, 
                      email = ?, 
                      tel_number = ?, 
                      password = ?, 
                      country = ?, 
                      address = ?, 
                      property_id = ?, 
                      site_id = ?, 
                      updated_at = ?, 
                      status = ? 
                  WHERE email = ? AND site_id = ?
              `;

          const values = [
            tenant.name,
            tenant.email,
            tenant.tel_number || "",
            tenant.password || "", // Assuming password can be updated
            tenant.country || "GA",
            tenant.address || "",
            tenant.property_id || null,
            req.user.site_id || req.user.site_id,
            stamp,
            tenant.status || "inactive", // Assuming status can be updated
            tenant.email,
            req.user.site_id,
          ];

          const [result] = await connection.query(updateQuery, values);

          if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({
              status: "FAILED",
              description: `Tenant with email ${tenant.email} not found`,
            });
          }

          updatedTenants.push({
            id: tenant.id, // Assuming tenant id exists in the input or result
            email: tenant.email,
            units: tenant.units || null,
          });
        }

        for (const tenant of updatedTenants) {
          console.log(
            "Clearing tenant",
            tenant.id,
            "from all units to be reassigned"
          );
          const clearTenantFromUnits = `
          UPDATE units
          SET tenant_id = null
          WHERE tenant_id = ?
        `;
          const clearValues = [tenant.id];
          await connection.query(clearTenantFromUnits, clearValues);

          if (Array.isArray(tenant.units) && tenant.units.length > 0) {
            for (const unitId of tenant.units) {
              console.log("Assigning tenant", tenant.id, "to unit", unitId);

              const updateUnitQuery = `
                UPDATE units
                SET tenant_id = ?
                WHERE id = ?
              `;
              const updateValues = [tenant.id, unitId];
              await connection.query(updateUnitQuery, updateValues);
            }
          }
        }

        await connection.commit();

        return res.status(200).json({
          status: "SUCCESS",
          description: `Successfully updated ${tenants.length} tenant(s)`,
          data: updatedTenants,
        });
      } catch (error) {
        await connection.rollback();
        console.error("Error updating tenants:", error);

        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to update tenants",
        });
      } finally {
        connection.release();
      }
    }
  );

  app.post(
    PREFIX + "/:tenant_id/resend-invite",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const { tenant_id } = req.params;
      const site_id = req.user.site_id;

      try {
        const [results] = await mysql_db.execute(
          `
            SELECT id, uuid, name, email, email_verification_status, email_invitation_status
            FROM tenants
            WHERE id = ? AND site_id = ? AND deleted_at IS NULL
          `,
          [tenant_id, site_id]
        );

        if (results.length === 0) {
          return res.status(404).json({
            status: "FAILED",
            description: "Tenant not found",
          });
        }

        const tenant = results[0];

        if (tenant.email_verification_status) {
          return res.status(400).json({
            status: "FAILED",
            description: "Tenant has already accepted the invitation",
          });
        }

        const email_verification_code = "VC-" + uuid();

        await mysql_db.execute(
          `
            UPDATE tenants
            SET email_verification_code = ?, email_invitation_status = 'resent', updated_at = NOW()
            WHERE id = ? AND site_id = ?
          `,
          [email_verification_code, tenant_id, site_id]
        );

        const invitationLink = `https://api.pm.proptios.com/verification-email/code/${email_verification_code}`;
        await emailActivation(tenant.email, tenant.name, invitationLink);

        return res.status(200).json({
          status: "SUCCESS",
          description: "Tenant invitation resent successfully",
        });
      } catch (error) {
        console.error("Error resending tenant invitation:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to resend tenant invitation",
        });
      }
    }
  );

  app.post(
    PREFIX + "/:tenant_id/enable",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const { tenant_id } = req.params;
      const site_id = req.user.site_id;

      try {
        const [result] = await mysql_db.execute(
          `
            UPDATE tenants
            SET status = 'active', updated_at = NOW()
            WHERE id = ? AND site_id = ? AND deleted_at IS NULL AND status != 'active'
          `,
          [tenant_id, site_id]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: "FAILED",
            description: "Tenant not found or already active",
          });
        }

        return res.status(200).json({
          status: "SUCCESS",
          description: "Tenant enabled successfully",
        });
      } catch (error) {
        console.error("Error enabling tenant:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to enable tenant",
        });
      }
    }
  );

  app.post(
    PREFIX + "/:tenant_id/disable",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const { tenant_id } = req.params;
      const site_id = req.user.site_id;

      try {
        const [result] = await mysql_db.execute(
          `
            UPDATE tenants
            SET status = 'inactive', updated_at = NOW()
            WHERE id = ? AND site_id = ? AND deleted_at IS NULL AND status != 'inactive'
          `,
          [tenant_id, site_id]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: "FAILED",
            description: "Tenant not found or already inactive",
          });
        }

        return res.status(200).json({
          status: "SUCCESS",
          description: "Tenant disabled successfully",
        });
      } catch (error) {
        console.error("Error disabling tenant:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to disable tenant",
        });
      }
    }
  );

  // GET: Retrieve tenant information
  app.get(
    PREFIX + "/:tenant_id",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const { tenant_id } = req.params;

      try {
        const selectQuery = `
          SELECT 
              tenants.id, 
              tenants.uuid, 
              tenants.dob,   
              tenants.name, 
              tenants.email, 
              tenants.address, 
              tenants.created_at, 
              tenants.updated_at, 
              tenants.status, 
              tenants.tel_number, 
              tenants.email_verification_status,
              tenants.email_invitation_status,
              tenants.logged_in, 
              tenants.logged_out, 
              tenants.country,
              
              properties.id AS property_id,
              properties.property_name AS property_name,
              properties.property_address AS property_address,
              properties.property_type AS property_type,
              properties.units AS property_units,

              
              transactions.id AS transaction_id,
              transactions.uuid AS transaction_uuid,
              transactions.amount AS transaction_amount,
              transactions.payment_method AS transaction_payment_method,
              transactions.status AS transaction_status,
              transactions.payment_type AS transaction_payment_type,
              transactions.currency AS transaction_currency,
              transactions.created_at AS transaction_created_at,
              
              leases.id AS lease_id,
              leases.lease_type AS lease_type,
              leases.document_url AS lease_document_url,
              
              id_documents.id AS id_document_id,
              id_documents.document_type AS id_document_type,
              id_documents.document_url AS id_document_url,
              
              maintenance_requests.id AS maintenance_request_id,
              maintenance_requests.media_type AS maintenance_media_type,
              maintenance_requests.media_url AS maintenance_media_url,
              maintenance_requests.request_owner AS maintenance_request_owner,
              maintenance_requests.created_at AS maintenance_request_created_at
              
          FROM 
              tenants
          LEFT JOIN properties ON tenants.property_id = properties.id
          LEFT JOIN transactions ON tenants.id = transactions.tenant_id
          LEFT JOIN leases ON tenants.id = leases.tenant_id
          LEFT JOIN units ON units.id = units.tenant_id
          LEFT JOIN id_documents ON tenants.id = id_documents.tenant_id
          LEFT JOIN maintenance_requests ON tenants.id = maintenance_requests.unit_id
          WHERE 
              tenants.id = ? AND tenants.site_id = ? AND tenants.deleted_at IS NULL;
        `;

        const unitsQuery = `SELECT * from units where tenant_id = ? AND tenants.site_id = ? AND tenants.deleted_at IS NULL`;

        const [results] = await mysql_db.execute(selectQuery, [
          tenant_id,
          req.user.site_id,
        ]);

        const [units] = await mysql_db.execute(selectQuery, [
          tenant_id,
          req.user.site_id,
        ]);

        if (results.length === 0) {
          return res.status(200).json({
            data: {},
            status: "NO_RES",
            description: "Tenant not found",
          });
        }

        const tenantInfo = {};
        const maintenanceRequests = new Map();
        const transactions = new Map();
        const idDocuments = new Map();
        const leases = new Map();

        results.forEach((row) => {
          // Populate tenant info
          if (row.id) {
            tenantInfo.id = row.id;
            tenantInfo.uuid = row.uuid;
            tenantInfo.dob = row.dob;
            tenantInfo.name = row.name;
            tenantInfo.email = row.email;
            tenantInfo.address = row.address;
            tenantInfo.created_at = row.created_at;
            tenantInfo.updated_at = row.updated_at;
            tenantInfo.status = row.status;
            tenantInfo.tel_number = row.tel_number;
            tenantInfo.email_verification_status =
              row.email_verification_status;
            tenantInfo.email_invitation_status = row.email_invitation_status;
            tenantInfo.logged_in = row.logged_in;
            tenantInfo.logged_out = row.logged_out;
            tenantInfo.country = row.country;
            tenantInfo.property = {
              id: row.property_id,
              name: row.property_name,
              address: row.property_address,
              type: row.property_type,
              units: row.property_units,
            };
          }

          // Collect unique maintenance requests
          if (row.maintenance_request_id) {
            maintenanceRequests.set(row.maintenance_request_id, {
              id: row.maintenance_request_id,
              media_type: row.maintenance_media_type,
              media_url: row.maintenance_media_url,
              request_owner: row.maintenance_request_owner,
              created_at: row.maintenance_request_created_at,
            });
          }

          // Collect unique transactions
          if (row.transaction_id) {
            transactions.set(row.transaction_id, {
              id: row.transaction_id,
              uuid: row.transaction_uuid,
              amount: row.transaction_amount,
              payment_method: row.transaction_payment_method,
              status: row.transaction_status,
              payment_type: row.transaction_payment_type,
              currency: row.transaction_currency,
              created_at: row.transaction_created_at,
            });
          }

          // Collect unique ID documents
          if (row.id_document_id) {
            idDocuments.set(row.id_document_id, {
              id: row.id_document_id,
              document_type: row.id_document_type,
              document_url: row.id_document_url,
            });
          }

          // Collect unique contract documents
          if (row.lease_id) {
            leases.set(row.leases, {
              id: row.lease_id,
              lease_type: row.lease_type,
              lease_document_url: row.document_url,
            });
          }
        });

        return res.status(200).json({
          status: "SUCCESS",
          data: {
            ...tenantInfo,
            maintenance_requests: Array.from(maintenanceRequests.values()),
            transactions: Array.from(transactions.values()), // Include transactions here
            id_documents: Array.from(idDocuments.values()),
            units: units,
            leases: Array.from(leases.values()),
          },
        });
      } catch (error) {
        console.error("Error fetching tenant:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch tenant",
        });
      }
    }
  );

  app.get(
    PREFIX,
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const limit = Math.max(parseInt(req.query.limit) || 10, 1);
      const offset = (page - 1) * limit;

      try {
        // First, count the total number of tenants for pagination
        const countQuery = `
          SELECT COUNT(DISTINCT tenants.id) AS totalTenants
          FROM tenants
          WHERE tenants.site_id = ? AND tenants.deleted_at IS NULL;
        `;
        const [countResult] = await mysql_db.execute(countQuery, [
          req.user.site_id,
        ]);
        const totalTenants = countResult[0].totalTenants;
        const totalPages = Math.ceil(totalTenants / limit);

        // Fetch tenants with pagination
        const selectQuery = `
          SELECT 
              tenants.id AS tenant_id, 
              tenants.uuid, 
              tenants.dob,   
              tenants.name, 
              tenants.email, 
              tenants.address, 
              tenants.created_at, 
              tenants.updated_at, 
              tenants.status, 
              tenants.tel_number, 
              tenants.email_verification_status,
              tenants.email_invitation_status,
              tenants.logged_in, 
              tenants.logged_out, 
              tenants.country,
              
              properties.id AS property_id,
              properties.property_name AS property_name,
              properties.property_address AS property_address,
              properties.property_type AS property_type,
              properties.units AS property_units,
              
              units.id AS unit_id,
              units.name AS unit_name,
              units.floor_no AS unit_floor_no,
              units.bedrooms AS unit_bedrooms,
              units.furnished AS unit_furnished_status,
              units.rent_amount AS unit_monthly_rent,
              units.unit_image_url AS unit_image_url,
              
              transactions.id AS transaction_id,
              transactions.uuid AS transaction_uuid,
              transactions.amount AS transaction_amount,
              transactions.payment_method AS transaction_payment_method,
              transactions.status AS transaction_status,
              transactions.payment_type AS transaction_payment_type,
              transactions.currency AS transaction_currency,
              transactions.created_at AS transaction_created_at,
              
              leases.id AS lease_id,
              leases.lease_type AS lease_type,
              leases.document_url AS lease_document_url,
              
              id_documents.id AS id_document_id,
              id_documents.document_type AS id_document_type,
              id_documents.document_url AS id_document_url,
              
              maintenance_requests.id AS maintenance_request_id,
              maintenance_requests.media_type AS maintenance_media_type,
              maintenance_requests.media_url AS maintenance_media_url,
              maintenance_requests.request_owner AS maintenance_request_owner,
              maintenance_requests.created_at AS maintenance_request_created_at
              
          FROM 
              (SELECT DISTINCT tenants.id 
               FROM tenants 
               WHERE tenants.site_id = ? 
               AND tenants.deleted_at IS NULL
               LIMIT ? OFFSET ?) AS unique_tenants
          JOIN tenants ON unique_tenants.id = tenants.id
          LEFT JOIN properties ON tenants.property_id = properties.id
          LEFT JOIN transactions ON tenants.id = transactions.tenant_id
          LEFT JOIN units ON tenants.id = units.tenant_id
          LEFT JOIN leases ON tenants.id = leases.tenant_id
          LEFT JOIN id_documents ON tenants.id = id_documents.tenant_id
          LEFT JOIN maintenance_requests ON tenants.id = maintenance_requests.unit_id
          WHERE 
              tenants.site_id = ?;
        `;

        const [results] = await mysql_db.execute(selectQuery, [
          req.user.site_id,
          limit,
          offset,
          req.user.site_id,
        ]);

        if (results.length === 0) {
          return res.status(200).json({
            data: [],
            status: "NO_RES",
            description: "No tenants found",
          });
        }

        const tenants = {};

        results.forEach((row) => {
          if (!tenants[row.tenant_id]) {
            tenants[row.tenant_id] = {
              id: row.tenant_id,
              uuid: row.uuid,
              dob: row.dob,
              name: row.name,
              email: row.email,
              address: row.address,
              created_at: row.created_at,
              updated_at: row.updated_at,
              status: row.status,
              tel_number: row.tel_number,
              email_verification_status: row.email_verification_status,
              email_invitation_status: row.email_invitation_status,
              logged_in: row.logged_in,
              logged_out: row.logged_out,
              country: row.country,
              property: {
                id: row.property_id,
                name: row.property_name,
                address: row.property_address,
                type: row.property_type,
                units: row.property_units,
              },
              unit: {
                id: row.unit_id,
                name: row.unit_name,
                floor_no: row.unit_floor_no,
                bedrooms: row.unit_bedrooms,
                furnished_status: row.unit_furnished_status,
                monthly_rent: row.unit_monthly_rent,
                unit_image_url: row.unit_image_url,
              },
              maintenance_requests: new Map(),
              transactions: new Map(),
              id_documents: new Map(),
              leases: new Map(),
            };
          }

          // Collect unique maintenance requests
          if (row.maintenance_request_id) {
            tenants[row.tenant_id].maintenance_requests.set(
              row.maintenance_request_id,
              {
                id: row.maintenance_request_id,
                media_type: row.maintenance_media_type,
                media_url: row.maintenance_media_url,
                request_owner: row.maintenance_request_owner,
                created_at: row.maintenance_request_created_at,
              }
            );
          }

          // Collect unique transactions
          if (row.transaction_id) {
            tenants[row.tenant_id].transactions.set(row.transaction_id, {
              id: row.transaction_id,
              uuid: row.transaction_uuid,
              amount: row.transaction_amount,
              payment_method: row.transaction_payment_method,
              status: row.transaction_status,
              payment_type: row.transaction_payment_type,
              currency: row.transaction_currency,
              created_at: row.transaction_created_at,
            });
          }

          // Collect unique ID documents
          if (row.id_document_id) {
            tenants[row.tenant_id].id_documents.set(row.id_document_id, {
              id: row.id_document_id,
              document_type: row.id_document_type,
              document_url: row.id_document_url,
            });
          }

          // Collect unique contract documents
          if (row.lease_id) {
            tenants[row.tenant_id].leases.set(row.lease_id, {
              id: row.lease_id,
              lease_type: row.lease_type,
              document_url: row.lease_document_url,
            });
          }
        });

        // Transform the map to array for each tenant
        const tenantArray = Object.values(tenants).map((tenant) => ({
          ...tenant,
          maintenance_requests: Array.from(
            tenant.maintenance_requests.values()
          ),
          transactions: Array.from(tenant.transactions.values()),
          id_documents: Array.from(tenant.id_documents.values()),
          leases: Array.from(tenant.leases.values()),
        }));

        return res.status(200).json({
          status: "SUCCESS",
          data: {
            totalTenants,
            totalPages,
            page,
            limit,
            items: tenantArray,
          },
          description: "Tenants retrieved successfully",
        });
      } catch (error) {
        console.error("Error fetching tenants:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch tenants",
        });
      }
    }
  );

  // PUT: Update tenant information
  app.put(
    PREFIX + "/:tenant_id",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const { property_id, tenant_id } = req.params;
      const { dob, name, email, address, tel_number, country } = req.body;

      if (!dob || !name || !email || !address || !tel_number || !country) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: required fields are missing",
        });
      }

      try {
        const updateQuery = `
      UPDATE tenants 
      SET dob = ?, name = ?, email = ?, address = ?, tel_number = ?, country = ?, updated_at = NOW() 
      WHERE id = ? AND property_id = ?
    `;
        const [result] = await mysql_db.execute(updateQuery, [
          dob,
          name,
          email,
          address,
          tel_number,
          country,
          tenant_id,
          property_id,
        ]);

        if (result.affectedRows === 0) {
          return res.status(200).json({
            data: [],
            status: "NO_RES",
            description: "Tenant not found",
          });
        }

        return res.status(200).json({
          status: "SUCCESS",
          description: "Successfully updated the tenant",
        });
      } catch (error) {
        console.error("Error updating tenant:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to update tenant",
        });
      }
    }
  );

  // Delete Tenants Endpoint
  app.delete(
    '/tenants',
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    async (req, res) => {
      const tenantUuids = req.body.uuids;
      const tenantIds = req.body.ids;
      const site_id = req.user.site_id;

      // Accept either uuids or ids (frontend sends ids)
      const useIds = Array.isArray(tenantIds) && tenantIds.length > 0;
      const identifiers = useIds ? tenantIds : tenantUuids;

      if (!Array.isArray(identifiers) || identifiers.length === 0) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: expected an array of tenant UUIDs or IDs"
        });
      }

      const idColumn = useIds ? "id" : "uuid";

      const connection = await mysql_db.getConnection();

      try {
        await connection.beginTransaction();

        // Verify tenants exist and belong to the site
        const [existingTenants] = await connection.query(
          `SELECT id, uuid FROM tenants
           WHERE ${idColumn} IN (?) AND site_id = ? AND deleted_at IS NULL`,
          [identifiers, site_id]
        );

        if (existingTenants.length !== identifiers.length) {
          return res.status(400).json({
            status: "FAILED",
            description: "One or more tenants not found or already deleted"
          });
        }

        // Check for active leases
        const [activeLeases] = await connection.query(
          `SELECT t.uuid
           FROM tenants t
           JOIN leases l ON t.id = l.tenant_id
           WHERE t.${idColumn} IN (?)
           AND t.site_id = ?
           AND l.deleted_at IS NULL`,
          [identifiers, site_id]
        );

        if (activeLeases.length > 0) {
          return res.status(400).json({
            status: "FAILED",
            description: "Cannot delete tenants with active leases"
          });
        }

        const stamp = moment().format("YYYY-MM-DD HH:mm:ss");

        // Soft delete tenants
        await connection.query(
          `UPDATE tenants
           SET deleted_at = ?
           WHERE ${idColumn} IN (?) AND site_id = ?`,
          [stamp, identifiers, site_id]
        );

        await connection.commit();

        return res.status(200).json({
          status: "SUCCESS",
          description: `Successfully deleted ${identifiers.length} tenant(s)`
        });

      } catch (error) {
        await connection.rollback();
        console.error("Error deleting tenants:", error);
        
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to delete tenants"
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
