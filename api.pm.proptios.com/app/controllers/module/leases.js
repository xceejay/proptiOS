const mysql_db = require("../../config/db.mysql");
const jwtMiddleware = require("../../middleware/jwt");
const acl = require("../../middleware/acl");
const moment = require("moment");
const uuid = require("uuid-random");

const PREFIX = "/leases";

const {
  earlyAccessMail,
  welcomeEmail,
  emailActivation,
  forgotPassword,
} = require("../emailers/core");

const {
  validateQuantity,
  trim,
  validateTimestamp,
  validateEmail,
  sendTelegramAlert,
} = require("../../services/utilities");

const propertyAccessChecks = require("../../middleware/acl");

// Emails to be sent to users via Postmark

const saltRounds = 10;
const secret = "mysecretsshhh";
const routes = (app) => {
  // Add multiple leases
  app.post(
    PREFIX,
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    async (req, res) => {
      const leases = req.body;

      if (!Array.isArray(leases) || leases.length === 0) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: expected an array of lease objects",
        });
      }

      // Validate each lease object
      for (const lease of leases) {
        const {
          unit_id,
          tenant_id,
          property_id,
          lease_start_date,
          lease_end_date,
          rent_amount,
          payment_methods // Added to capture payment methods array
        } = lease;

        if (
          !unit_id ||
          !tenant_id ||
          !property_id ||
          !lease_start_date ||
          !lease_end_date ||
          !rent_amount ||
          !Array.isArray(payment_methods) || payment_methods.length === 0 // Ensure payment methods are provided and are valid
        ) {
          return res.status(400).json({
            status: "FAILED",
            description:
              "Invalid input: required fields or payment methods are missing for one or more leases",
          });
        }
      }

      let stamp = moment().format("YYYY-MM-DD HH:mm:ss");

      const connection = await mysql_db.getConnection(); // Get a connection from the pool

      try {
        await connection.beginTransaction(); // Start the transaction

        const insertedLeases = []; // Array to store the inserted lease's IDs

        for (const lease of leases) {
          // Check if a lease already exists for this tenant and unit
          const checkQuery = `
            SELECT id FROM leases 
            WHERE tenant_id = ? AND unit_id = ? AND property_id = ? AND site_id = ? 
              AND status = 'active'
          `;

          const [existingLeases] = await connection.query(checkQuery, [
            lease.tenant_id,
            lease.unit_id,
            lease.property_id,
            req.user.site_id,
          ]);

          if (existingLeases.length > 0) {
            // If a lease already exists, return an error
            return res.status(409).json({
              status: "FAILED",
              description: `A lease already exists between tenant ID ${lease.tenant_id} and unit ID ${lease.unit_id}`,
            });
          }

          const uuidValue = uuid(); // Generate a new UUID for each lease
          const insertQuery = `
            INSERT INTO leases (
              uuid, tenant_id, property_id, unit_id, lease_type, start_date, end_date, rent_amount, security_deposit, late_fee, 
              grace_period, renewal_terms, termination_clause, notice_period, early_termination_fee, rent_increase_rate, payment_frequency,
              currency, created_at, updated_at, status, lease_html, lease_text, site_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const values = [
            uuidValue,
            lease.tenant_id,
            lease.property_id,
            lease.unit_id,
            lease.lease_type || "standard", // Default to 'standard' if not provided
            moment(lease.lease_start_date).format("YYYY-MM-DD HH:mm:ss"),
            moment(lease.lease_end_date).format("YYYY-MM-DD HH:mm:ss"),
            lease.rent_amount,
            lease.security_deposit || 0,
            lease.late_fee || 0,
            lease.grace_period || 0,
            lease.renewal_terms || "",
            lease.termination_clause || "",
            lease.notice_period || 0,
            lease.early_termination_fee || 0,
            lease.rent_increase_rate || 0,
            lease.payment_frequency || "monthly",
            lease.currency || "USD",
            stamp,
            stamp,
            "active", // Default status to 'active'
            lease.lease_html,
            lease.lease_text,
            req.user.site_id,
          ];

          const [result] = await connection.query(insertQuery, values); // Insert each lease one by one

          // Insert payment methods into `lease_payment_methods`
          const leaseId = result.insertId;
          for (const paymentMethod of lease.payment_methods) {
            const paymentMethodQuery = `
              INSERT INTO lease_payment_methods (lease_id, payment_method)
              VALUES (?, ?)
              ON DUPLICATE KEY UPDATE lease_id = lease_id
            `; // Prevent duplicate entries by using `ON DUPLICATE KEY UPDATE`

            await connection.query(paymentMethodQuery, [leaseId, paymentMethod]);
          }

          // Add the insertId to the insertedLeases array
          insertedLeases.push({
            id: leaseId.toString(),
            tenant_id: lease.tenant_id,
            property_id: lease.property_id,
            unit_id: lease.unit_id,
          });
        }

        await connection.commit(); // Commit the transaction if all inserts are successful

        return res.status(201).json({
          status: "SUCCESS",
          description: `Successfully inserted ${leases.length} lease(s)`,
          data: insertedLeases, // Return the array of inserted leases' IDs
        });
      } catch (error) {
        await connection.rollback(); // Rollback the transaction in case of error
        console.error("Error inserting leases:", error);

        // Check for specific MySQL error codes
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            status: "FAILED",
            description:
              "Duplicate entry: one or more leases have already been registered with the same tenant or property",
          });
        }

        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to insert leases",
        });
      } finally {
        connection.release(); // Release the connection back to the pool
      }
    }
  );

  // Modify Leases
app.put(
  PREFIX,
  jwtMiddleware,
  acl(["property_owner", "property_manager", "property_coordinator"]),

  async (req, res) => {
    const leases = req.body;

    console.log(leases);

    if (!Array.isArray(leases) || leases.length === 0) {
      return res.status(400).json({
        status: "FAILED",
        description: "Invalid input: expected an array of lease objects",
      });
    }

    // Validate each lease object
    for (const lease of leases) {
      const {
        tenant_id,
        property_id,
        start_date,
        end_date,
        rent_amount,
        payment_methods // Added to capture the payment methods
      } = lease;

      if (
        !tenant_id ||
        !property_id ||
        !start_date ||
        !end_date ||
        !rent_amount ||
        !Array.isArray(payment_methods) || payment_methods.length === 0 // Ensure payment methods are provided and are valid
      ) {
        return res.status(400).json({
          status: "FAILED",
          description:
            "Invalid input: required fields or payment methods are missing for one or more leases",
        });
      }
    }

    let stamp = moment().format("YYYY-MM-DD HH:mm:ss");

    const connection = await mysql_db.getConnection();

    try {
      await connection.beginTransaction();

      const updatedLeases = [];

      for (const lease of leases) {
        // Update the lease details
        const updateQuery = `
          UPDATE leases
          SET 
            tenant_id = ?, 
            property_id = ?, 
            unit_id = ?, 
            lease_type = ?, 
            start_date = ?, 
            end_date = ?, 
            rent_amount = ?, 
            security_deposit = ?, 
            late_fee = ?, 
            grace_period = ?, 
            renewal_terms = ?, 
            termination_clause = ?, 
            notice_period = ?, 
            early_termination_fee = ?, 
            rent_increase_rate = ?, 
            payment_frequency = ?, 
            currency = ?, 
            updated_at = ?, 
            status = ? 
          WHERE uuid = ? AND site_id = ?
        `;

        const values = [
          lease.tenant_id,
          lease.property_id,
          lease.unit_id || null,
          lease.lease_type || "standard", // Default to 'standard' if not provided
          lease.start_date,
          lease.end_date,
          lease.rent_amount,
          lease.security_deposit || 0,
          lease.late_fee || 0,
          lease.grace_period || 0,
          lease.renewal_terms || "",
          lease.termination_clause || "",
          lease.notice_period || 0,
          lease.early_termination_fee || 0,
          lease.rent_increase_rate || 0,
          lease.payment_frequency || "monthly",
          lease.currency || "USD",
          stamp,
          lease.status || "active", // Assuming status can be updated
          lease.uuid,
          req.user.site_id,
        ];

        const [result] = await connection.query(updateQuery, values);

        if (result.affectedRows === 0) {
          await connection.rollback();
          return res.status(404).json({
            status: "FAILED",
            description: `Lease with UUID ${lease.uuid} not found`,
          });
        }

        // Update payment methods: Remove old and insert new
        const deletePaymentMethodsQuery = `
          DELETE FROM lease_payment_methods 
          WHERE lease_id = (SELECT id FROM leases WHERE uuid = ? AND site_id = ?)
        `;

        await connection.query(deletePaymentMethodsQuery, [lease.uuid, req.user.site_id]);

        for (const paymentMethod of lease.payment_methods) {
          const insertPaymentMethodQuery = `
            INSERT INTO lease_payment_methods (lease_id, payment_method)
            VALUES (
              (SELECT id FROM leases WHERE uuid = ? AND site_id = ?),
              ?
            )
          `;

          await connection.query(insertPaymentMethodQuery, [
            lease.uuid,
            req.user.site_id,
            paymentMethod
          ]);
        }

        updatedLeases.push({
          id: lease.uuid,
          tenant_id: lease.tenant_id,
          property_id: lease.property_id,
          unit_id: lease.unit_id,
        });
      }

      await connection.commit();

      return res.status(200).json({
        status: "SUCCESS",
        description: `Successfully updated ${leases.length} lease(s)`,
        data: updatedLeases,
      });
    } catch (error) {
      await connection.rollback();
      console.error("Error updating leases:", error);

      return res.status(500).json({
        status: "FAILED",
        description: "Server Error: Failed to update leases",
      });
    } finally {
      connection.release();
    }
  }
);


  // Get multiple leases
  app.get(
    PREFIX,
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    async (req, res) => {
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const limit = Math.max(parseInt(req.query.limit) || 10, 1);
      const offset = (page - 1) * limit;
  
      try {
        // First, count the total number of leases for pagination
        const countQuery = `
          SELECT COUNT(DISTINCT leases.id) AS totalLeases
          FROM leases
          WHERE leases.site_id = ? AND leases.deleted_at IS NULL
        `;
        const [countResult] = await mysql_db.execute(countQuery, [
          req.user.site_id,
        ]);
        const totalLeases = countResult[0].totalLeases;
        const totalPages = Math.ceil(totalLeases / limit);
  
        // Fetch leases with pagination
        const selectQuery = `
          SELECT 
            leases.id AS lease_id,
            leases.uuid,
            leases.tenant_id AS lease_tenant_id,
            leases.property_id AS lease_property_id,
            leases.unit_id AS lease_unit_id,
            leases.lease_type,
            leases.start_date,
            leases.end_date,
            leases.rent_amount,
            leases.security_deposit,
            leases.late_fee,
            leases.grace_period,
            leases.renewal_terms,
            leases.termination_clause,
            leases.notice_period,
            leases.early_termination_fee,
            leases.rent_increase_rate,
            leases.payment_frequency,
            leases.currency,
            leases.status,
            leases.created_at,
            leases.updated_at,
    
            tenants.name AS tenant_name,
            tenants.email AS tenant_email,
            tenants.tel_number AS tenant_tel_number,
    
            properties.property_name AS property_name,
            properties.property_address AS property_address,
            properties.property_type AS property_type,
    
            units.name AS unit_name,
            units.floor_no AS unit_floor_no,
            units.bedrooms AS unit_bedrooms,
            units.furnished AS unit_furnished_status,
            units.rent_amount AS unit_monthly_rent,
  
            lease_payment_methods.payment_method
          FROM leases
          LEFT JOIN tenants ON leases.tenant_id = tenants.id
          LEFT JOIN properties ON leases.property_id = properties.id
          LEFT JOIN units ON leases.unit_id = units.id
          LEFT JOIN lease_payment_methods ON leases.id = lease_payment_methods.lease_id
          WHERE leases.site_id = ? AND leases.deleted_at IS NULL
          LIMIT ? OFFSET ?
        `;
  
        const [results] = await mysql_db.execute(selectQuery, [
          req.user.site_id,
          limit,
          offset,
        ]);
  
        if (results.length === 0) {
          return res.status(200).json({
            data: [],
            status: "NO_RES",
            description: "No leases found",
          });
        }
  
        const leases = {};
  
        results.forEach((row) => {
          if (!leases[row.lease_id]) {
            leases[row.lease_id] = {
              id: row.lease_id,
              uuid: row.uuid,
              tenant_id: row.lease_tenant_id,
              property_id: row.lease_property_id,
              unit_id: row.lease_unit_id,
              lease_type: row.lease_type,
              start_date: row.start_date,
              end_date: row.end_date,
              rent_amount: row.rent_amount,
              security_deposit: row.security_deposit,
              late_fee: row.late_fee,
              grace_period: row.grace_period,
              renewal_terms: row.renewal_terms,
              termination_clause: row.termination_clause,
              notice_period: row.notice_period,
              early_termination_fee: row.early_termination_fee,
              rent_increase_rate: row.rent_increase_rate,
              payment_frequency: row.payment_frequency,
              currency: row.currency,
              status: row.status,
              created_at: row.created_at,
              updated_at: row.updated_at,
              tenant: {
                name: row.tenant_name,
                email: row.tenant_email,
                tel_number: row.tenant_tel_number,
              },
              property: {
                name: row.property_name,
                address: row.property_address,
                type: row.property_type,
              },
              unit: {
                name: row.unit_name,
                floor_no: row.unit_floor_no,
                bedrooms: row.unit_bedrooms,
                furnished_status: row.unit_furnished_status,
                monthly_rent: row.unit_monthly_rent,
              },
              payment_methods: [], // Initialize payment methods array
            };
          }
  
          // Add payment methods to each lease
          if (row.payment_method && !leases[row.lease_id].payment_methods.includes(row.payment_method)) {
            leases[row.lease_id].payment_methods.push(row.payment_method);
          }
        });
  
        // Convert leases object to array
        const leaseArray = Object.values(leases);
  
        return res.status(200).json({
          status: "SUCCESS",
          data: {
            totalLeases,
            totalPages,
            page,
            limit,
            items: leaseArray,
          },
          description: "Leases retrieved successfully",
        });
      } catch (error) {
        console.error("Error fetching leases:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch leases",
        });
      }
    }
  );

  // GET: Retrieve lease information by ID
 // GET: Retrieve lease information by ID
app.get(
  PREFIX + "/:lease_id",
  jwtMiddleware,
  acl(["property_owner", "property_manager", "property_coordinator"]),

  async (req, res) => {
    const { lease_id } = req.params;

    try {
      const selectQuery = `
        SELECT 
          leases.id AS lease_id,
          leases.uuid,
          leases.tenant_id AS lease_tenant_id,
          leases.property_id AS lease_property_id,
          leases.unit_id AS lease_unit_id,
          leases.lease_type,
          leases.start_date,
          leases.end_date,
          leases.rent_amount,
          leases.security_deposit,
          leases.late_fee,
          leases.grace_period,
          leases.renewal_terms,
          leases.termination_clause,
          leases.notice_period,
          leases.early_termination_fee,
          leases.rent_increase_rate,
          leases.payment_frequency,
          leases.currency,
          leases.lease_html,
          leases.lease_text,
          leases.status,
          leases.created_at,
          leases.updated_at,
  
          tenants.name AS tenant_name,
          tenants.email AS tenant_email,
          tenants.tel_number AS tenant_tel_number,
  
          properties.property_name AS property_name,
          properties.property_address AS property_address,
          properties.property_type AS property_type,
  
          units.name AS unit_name,
          units.floor_no AS unit_floor_no,
          units.bedrooms AS unit_bedrooms,
          units.furnished AS unit_furnished_status,
          units.rent_amount AS unit_monthly_rent,
          
          lease_payment_methods.payment_method
        FROM leases
        LEFT JOIN tenants ON leases.tenant_id = tenants.id
        LEFT JOIN properties ON leases.property_id = properties.id
        LEFT JOIN units ON leases.unit_id = units.id
        LEFT JOIN lease_payment_methods ON leases.id = lease_payment_methods.lease_id
        WHERE leases.id = ? AND leases.site_id = ? AND leases.deleted_at IS NULL
      `;

      const [results] = await mysql_db.execute(selectQuery, [
        lease_id,
        req.user.site_id,
      ]);

      if (results.length === 0) {
        return res.status(200).json({
          data: [],
          status: "NO_RES",
          description: "Lease not found",
        });
      }

      const row = results[0];

      // Build the lease information
      const leaseInfo = {
        id: row.lease_id,
        uuid: row.uuid,
        tenant_id: row.lease_tenant_id,
        property_id: row.lease_property_id,
        unit_id: row.lease_unit_id,
        lease_type: row.lease_type,
        start_date: row.start_date,
        end_date: row.end_date,
        rent_amount: row.rent_amount,
        security_deposit: row.security_deposit,
        late_fee: row.late_fee,
        grace_period: row.grace_period,
        renewal_terms: row.renewal_terms,
        termination_clause: row.termination_clause,
        notice_period: row.notice_period,
        early_termination_fee: row.early_termination_fee,
        rent_increase_rate: row.rent_increase_rate,
        payment_frequency: row.payment_frequency,
        currency: row.currency,
        lease_html: row.lease_html,
        lease_text: row.lease_text,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.updated_at,
        payment_methods: [], // Initialize the payment methods array
      };

      // Populate tenant, property, and unit information
      const tenantInfo = {
        name: row.tenant_name,
        email: row.tenant_email,
        tel_number: row.tenant_tel_number,
      };

      const propertyInfo = {
        name: row.property_name,
        address: row.property_address,
        type: row.property_type,
      };

      const unitInfo = {
        name: row.unit_name,
        floor_no: row.unit_floor_no,
        bedrooms: row.unit_bedrooms,
        furnished_status: row.unit_furnished_status,
        monthly_rent: row.unit_monthly_rent,
      };

      // Add payment methods to the leaseInfo object
      results.forEach((r) => {
        if (r.payment_method && !leaseInfo.payment_methods.includes(r.payment_method)) {
          leaseInfo.payment_methods.push(r.payment_method);
        }
      });

      return res.status(200).json({
        status: "SUCCESS",
        data: {
          ...leaseInfo,
          tenant: tenantInfo,
          property: propertyInfo,
          unit: unitInfo,
        },
        description: "Lease retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching lease:", error);
      return res.status(500).json({
        status: "FAILED",
        description: "Server Error: Failed to fetch lease",
      });
    }
  }
);



// Delete Leases Endpoint
app.delete(
  '/leases',
  jwtMiddleware,
  acl(["property_owner", "property_manager", "property_coordinator"]),
  async (req, res) => {
    const leaseUuids = req.body.uuids;
    const site_id = req.user.site_id;

    if (!Array.isArray(leaseUuids) || leaseUuids.length === 0) {
      return res.status(400).json({
        status: "FAILED",
        description: "Invalid input: expected an array of lease UUIDs"
      });
    }

    const connection = await mysql_db.getConnection();

    try {
      await connection.beginTransaction();

      // Verify leases exist and belong to the site
      const [existingLeases] = await connection.query(
        `SELECT id, uuid FROM leases 
         WHERE uuid IN (?) AND site_id = ? AND deleted_at IS NULL`,
        [leaseUuids, site_id]
      );

      if (existingLeases.length !== leaseUuids.length) {
        return res.status(400).json({
          status: "FAILED",
          description: "One or more leases not found or already deleted"
        });
      }

      const stamp = moment().format("YYYY-MM-DD HH:mm:ss");

      // Update units to remove lease reference
      await connection.query(
        `UPDATE units u
         JOIN leases l ON u.lease_id = l.id
         SET u.lease_id = NULL, u.tenant_id = NULL,
             u.updated_at = ?
         WHERE l.uuid IN (?) AND l.site_id = ?`,
        [stamp, leaseUuids, site_id]
      );

      // Soft delete leases
      await connection.query(
        `UPDATE leases 
         SET deleted_at = ? 
         WHERE uuid IN (?) AND site_id = ?`,
        [stamp, leaseUuids, site_id]
      );

      await connection.commit();

      return res.status(200).json({
        status: "SUCCESS",
        description: `Successfully deleted ${leaseUuids.length} lease(s)`
      });

    } catch (error) {
      await connection.rollback();
      console.error("Error deleting leases:", error);
      
      return res.status(500).json({
        status: "FAILED",
        description: "Server Error: Failed to delete leases"
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
