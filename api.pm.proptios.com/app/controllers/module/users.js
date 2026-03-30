const mysql_db = require("../../config/db.mysql");
const jwtMiddleware = require("../../middleware/jwt");
const acl = require("../../middleware/acl");

const PREFIX = "/users";

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

const saltRounds = 10;
const secret = "mysecretsshhh";

const routes = (app) => {
  app.put(
    PREFIX + "/:id",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const user_id = req.params.id;
      const { name, address, tel_number, country } = req.body;

      if (!name || !address || !tel_number || !country) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: required fields are missing",
        });
      }

      try {
        const updateQuery =
          "UPDATE pm_users SET name = ?, address = ?, tel_number = ?, country = ?, updated_at = NOW() WHERE id = ?";
        const [result] = await mysql_db.execute(updateQuery, [
          name,
          address,
          tel_number,
          country,
          user_id,
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
          description: "Successfully updated the user",
        });
      } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to update user",
        });
      }
    }
  );

  // add user to db
  app.post(
    PREFIX,
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const pm_users = req.body;

      console.log(pm_users);

      if (!Array.isArray(pm_users) || pm_users.length === 0) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: expected an array of user objects",
        });
      }

      // Validate each user object
      for (const user of pm_users) {
        const { name, email } = user;
        if (!name || !email) {
          return res.status(400).json({
            status: "FAILED",
            description:
              "Invalid input: required fields are missing for one or more pm_users",
          });
        }
      }

      let stamp = moment().format("YYYY-MM-DD HH:mm:ss");

      const connection = await mysql_db.getConnection(); // Get a connection from the pool

      try {
        await connection.beginTransaction(); // Start the transaction

        const insertedTenants = []; // Array to store the inserted user's IDs and emails

        for (const user of pm_users) {
          const uuidValue = uuid(); // Generate a new UUID for each user
          const insertQuery = `
            INSERT INTO pm_users (
              uuid, name, email, tel_number, password, country, address, property_id, site_id, created_at, updated_at, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const values = [
            uuidValue,
            user.name,
            user.email,
            user.tel_number || "", // Set to empty string if not provided
            uuidValue, // Temporarily setting UUID as password
            user.country || "GHA", // Default to 'GHA' if not provided
            user.address || "", // Set to empty string if not provided
            user.property_id || null,
            req.user.site_id,
            stamp,
            stamp,
            "inactive", // Default status to 'inactive'
          ];

          const [result] = await connection.query(insertQuery, values); // Insert each user one by one

          // Add the insertId and email to the insertedTenants array
          insertedTenants.push({
            id: result.insertId.toString(),
            email: user.email,
            units: user.units, // Store the array of units
          });
        }

        await connection.commit(); // Commit the transaction if all inserts are successful

        // Now update the units table for each user and their corresponding units
        for (const user of insertedTenants) {
          if (Array.isArray(user.units) && user.units.length > 0) {
            for (const unitId of user.units) {
              console.log("Assigning user", user.id, "to unit", unitId);

              const updateUnitQuery = `
                UPDATE units
                SET user_id = ?
                WHERE id = ?
              `;
              const updateValues = [user.id, unitId];
              await connection.query(updateUnitQuery, updateValues);
            }
          }
        }

        return res.status(201).json({
          status: "SUCCESS",
          description: `Successfully inserted ${pm_users.length} user(s)`,
          data: insertedTenants, // Return the array of inserted pm_users' IDs and emails
        });
      } catch (error) {
        await connection.rollback(); // Rollback the transaction in case of error
        console.error("Error inserting pm_users:", error);

        // Check for specific MySQL error codes
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            status: "FAILED",
            description:
              "Duplicate entry: one or more pm_users have already been registered with the same email or UUID",
          });
        }

        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to insert pm_users",
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
      const pm_users = req.body;

      console.log(pm_users);

      if (!Array.isArray(pm_users) || pm_users.length === 0) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: expected an array of user objects",
        });
      }

      for (const user of pm_users) {
        const { name, email } = user;
        if (!name || !email) {
          return res.status(400).json({
            status: "FAILED",
            description:
              "Invalid input: required fields are missing for one or more pm_users",
          });
        }
      }

      let stamp = moment().format("YYYY-MM-DD HH:mm:ss");

      const connection = await mysql_db.getConnection();

      try {
        await connection.beginTransaction();

        const updatedTenants = [];

        for (const user of pm_users) {
          const updateQuery = `
                  UPDATE pm_users 
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
            user.name,
            user.email,
            user.tel_number || "",
            user.password || "", // Assuming password can be updated
            user.country || "GA",
            user.address || "",
            user.property_id || null,
            req.user.site_id || req.user.site_id,
            stamp,
            user.status || "inactive", // Assuming status can be updated
            user.email,
            req.user.site_id,
          ];

          const [result] = await connection.query(updateQuery, values);

          if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({
              status: "FAILED",
              description: `Tenant with email ${user.email} not found`,
            });
          }

          updatedTenants.push({
            id: user.id, // Assuming user id exists in the input or result
            email: user.email,
            units: user.units || null,
          });
        }

        for (const user of updatedTenants) {
          console.log(
            "Clearing user",
            user.id,
            "from all units to be reassigned"
          );
          const clearTenantFromUnits = `
          UPDATE units
          SET user_id = null
          WHERE user_id = ?
        `;
          const clearValues = [user.id];
          await connection.query(clearTenantFromUnits, clearValues);

          if (Array.isArray(user.units) && user.units.length > 0) {
            for (const unitId of user.units) {
              console.log("Assigning user", user.id, "to unit", unitId);

              const updateUnitQuery = `
                UPDATE units
                SET user_id = ?
                WHERE id = ?
              `;
              const updateValues = [user.id, unitId];
              await connection.query(updateUnitQuery, updateValues);
            }
          }
        }

        await connection.commit();

        return res.status(200).json({
          status: "SUCCESS",
          description: `Successfully updated ${pm_users.length} user(s)`,
          data: updatedTenants,
        });
      } catch (error) {
        await connection.rollback();
        console.error("Error updating pm_users:", error);

        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to update pm_users",
        });
      } finally {
        connection.release();
      }
    }
  );

  // GET: Retrieve user information
  app.get(
    PREFIX + "/:user_id",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const { user_id } = req.params;

      try {
        const selectQuery = `
          SELECT 
              pm_users.id, 
              pm_users.uuid, 
              pm_users.dob,   
              pm_users.name, 
              pm_users.email, 
              pm_users.address, 
              pm_users.created_at, 
              pm_users.updated_at, 
              pm_users.status, 
              pm_users.tel_number, 
              pm_users.logged_in, 
              pm_users.logged_out, 
              pm_users.country,
              
              properties.id AS property_id,
              properties.property_name AS property_name,
              properties.property_address AS property_address,
              properties.property_type AS property_type,
              properties.units AS property_units,
              
              units.id AS unit_id,
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
              pm_users
          LEFT JOIN properties ON pm_users.property_id = properties.id
          LEFT JOIN transactions ON pm_users.id = transactions.user_id
          LEFT JOIN leases ON pm_users.id = leases.user_id
          LEFT JOIN units ON units.id = units.user_id
          LEFT JOIN id_documents ON pm_users.id = id_documents.user_id
          LEFT JOIN maintenance_requests ON pm_users.id = maintenance_requests.unit_id
          WHERE 
              pm_users.id = ? AND pm_users.site_id = ? AND pm_users.deleted_at IS NULL;
        `;
        const [results] = await mysql_db.execute(selectQuery, [
          user_id,
          req.user.site_id,
        ]);

        if (results.length === 0) {
          return res.status(200).json({
            data: [],
            status: "NO_RES",
            description: "Tenant not found",
          });
        }

        const userInfo = {};
        const maintenanceRequests = new Map();
        const transactions = new Map();
        const idDocuments = new Map();
        const leases = new Map();

        results.forEach((row) => {
          // Populate user info
          if (row.id) {
            userInfo.id = row.id;
            userInfo.uuid = row.uuid;
            userInfo.dob = row.dob;
            userInfo.name = row.name;
            userInfo.email = row.email;
            userInfo.address = row.address;
            userInfo.created_at = row.created_at;
            userInfo.updated_at = row.updated_at;
            userInfo.status = row.status;
            userInfo.tel_number = row.tel_number;
            userInfo.logged_in = row.logged_in;
            userInfo.logged_out = row.logged_out;
            userInfo.country = row.country;
            userInfo.property = {
              id: row.property_id,
              name: row.property_name,
              address: row.property_address,
              type: row.property_type,
              units: row.property_units,
            };
            userInfo.unit = {
              id: row.unit_id,
              floor_no: row.unit_floor_no,
              bedrooms: row.unit_bedrooms,
              furnished_status: row.unit_furnished_status,
              monthly_rent: row.unit_monthly_rent,
              unit_image_url: row.unit_image_url,
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
            ...userInfo,
            maintenance_requests: Array.from(maintenanceRequests.values()),
            transactions: Array.from(transactions.values()), // Include transactions here
            id_documents: Array.from(idDocuments.values()),
            leases: Array.from(leases.values()),
          },
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch user",
        });
      }
    }
  );

  app.get(
    PREFIX,
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    
    async (req, res) => {
      const page = req.query.page ? Math.max(parseInt(req.query.page) || 1, 1) : null;
      const limit = req.query.limit ? Math.max(parseInt(req.query.limit) || 10, 1) : null;
      const offset = page && limit ? (page - 1) * limit : null;
  
      try {
        // Count the total number of pm_users for pagination
        const countQuery = `
          SELECT COUNT(DISTINCT pm_users.id) AS totalPmUsers
          FROM pm_users
          WHERE pm_users.site_id = ? AND pm_users.deleted_at IS NULL
        `;
        const [countResult] = await mysql_db.execute(countQuery, [req.user.site_id]);
        const totalPmUsers = countResult[0].totalPmUsers;
  
        // Calculate totalPages only if pagination is applied
        const totalPages = limit ? Math.ceil(totalPmUsers / limit) : null;
  
        // Prepare the base query without LIMIT/OFFSET
        let selectQuery = `
          SELECT 
              pm_users.id AS user_id, 
              pm_users.uuid, 
              pm_users.dob,   
              pm_users.name, 
              pm_users.email, 
              pm_users.address, 
              pm_users.created_at, 
              pm_users.updated_at, 
              pm_users.status, 
              pm_users.user_type, 
              pm_users.invitation_status, 
              pm_users.tel_number, 
              pm_users.logged_in, 
              pm_users.logged_out, 
              pm_users.country,
              
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
              pm_users
          LEFT JOIN properties ON pm_users.id = properties.pm_user_id
          LEFT JOIN transactions ON pm_users.id = transactions.pm_user_id
          LEFT JOIN units ON pm_users.id = units.pm_user_id
          LEFT JOIN leases ON pm_users.id = leases.pm_user_id
          LEFT JOIN id_documents ON pm_users.id = id_documents.pm_user_id
          LEFT JOIN maintenance_requests ON pm_users.id = maintenance_requests.pm_user_id
          WHERE 
              pm_users.site_id = ? AND pm_users.deleted_at IS NULL
        `;
  
        // Append LIMIT and OFFSET clauses if pagination is applied
        const queryParams = [req.user.site_id];
        if (limit && offset !== null) {
          selectQuery += ` LIMIT ? OFFSET ?`;
          queryParams.push(limit, offset);
        }
  
        // Execute the select query
        const [results] = await mysql_db.execute(selectQuery, queryParams);
  
        if (results.length === 0) {
          return res.status(200).json({
            data: [],
            status: "NO_RES",
            description: "No pm_users found",
          });
        }
  
        const pm_users = {};
  
        results.forEach((row) => {
          if (!pm_users[row.user_id]) {
            pm_users[row.user_id] = {
              id: row.user_id,
              uuid: row.uuid,
              dob: row.dob,
              name: row.name,
              email: row.email,
              address: row.address,
              created_at: row.created_at,
              updated_at: row.updated_at,
              user_type: row.user_type,
              status: row.status,
              invitation_status: row.invitation_status,
              tel_number: row.tel_number,
              logged_in: row.logged_in,
              logged_out: row.logged_out,
              country: row.country,
              properties: [],
              units: [],
              maintenance_requests: [],
              transactions: [],
              id_documents: [],
              leases: [],
            };
          }
  
          // Collect unique properties
          if (row.property_id) {
            pm_users[row.user_id].properties.push({
              id: row.property_id,
              name: row.property_name,
              address: row.property_address,
              type: row.property_type,
              units: row.property_units,
            });
          }
  
          // Collect unique units
          if (row.unit_id) {
            pm_users[row.user_id].units.push({
              id: row.unit_id,
              name: row.unit_name,
              floor_no: row.unit_floor_no,
              bedrooms: row.unit_bedrooms,
              furnished_status: row.unit_furnished_status,
              monthly_rent: row.unit_monthly_rent,
              unit_image_url: row.unit_image_url,
            });
          }
  
          // Collect unique maintenance requests
          if (row.maintenance_request_id) {
            pm_users[row.user_id].maintenance_requests.push({
              id: row.maintenance_request_id,
              media_type: row.maintenance_media_type,
              media_url: row.maintenance_media_url,
              request_owner: row.maintenance_request_owner,
              created_at: row.maintenance_request_created_at,
            });
          }
  
          // Collect unique transactions
          if (row.transaction_id) {
            pm_users[row.user_id].transactions.push({
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
            pm_users[row.user_id].id_documents.push({
              id: row.id_document_id,
              document_type: row.id_document_type,
              document_url: row.id_document_url,
            });
          }
  
          // Collect unique leases
          if (row.lease_id) {
            pm_users[row.user_id].leases.push({
              id: row.lease_id,
              lease_type: row.lease_type,
              document_url: row.lease_document_url,
            });
          }
        });
  
        // Transform all collections into arrays and return the results
        const userArray = Object.values(pm_users).map((user) => ({
          ...user,
          properties: user.properties, // Already an array
          units: user.units,           // Already an array
          maintenance_requests: user.maintenance_requests,
          transactions: user.transactions,
          id_documents: user.id_documents,
          leases: user.leases,
        }));
  
        return res.status(200).json({
          status: "SUCCESS",
          data: {
            totalPmUsers,
            totalPages: totalPages || 1, // If no pagination, just return 1 page
            page: page || 1,             // Default to page 1 if no pagination
            limit: limit || totalPmUsers, // If no limit, return all results
            items: userArray,
          },
        });
      } catch (error) {
        console.error("Error fetching pm_users:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch pm_users",
        });
      }
    }
  );
  





  app.post(PREFIX + "/disable", async (req, res) => {
    let email = req.body.email;

    // Prevent users from disabling themselves
    if (req.user && req.user.email === email) {
      return res.status(403).json({
        status: "FAILED",
        description: "You cannot disable your own account",
      });
    }

    let selectQuery = `
      SELECT pm_users.* 
      FROM pm_users
      WHERE pm_users.email = ? AND pm_users.email_verification_status = true AND pm_users.status != 'disabled'
    `;
  
    let disableQuery =
      "UPDATE pm_users SET status = 'disabled', updated_at = CURRENT_TIMESTAMP() WHERE email = ?";
  
    let results;
    try {
      [results] = await mysql_db.execute(selectQuery, [email]);
  
      if (results.length > 0) {
        // Disable the user
        await mysql_db.execute(disableQuery, [email]);
  
        return res.status(200).json({
          status: "SUCCESS",
          description: "User disabled successfully",
        });
      } else {
        return res.status(404).json({
          status: "FAILED",
          description: "User not found or already disabled",
        });
      }
    } catch (error) {
      console.log(error);
  
      return res.status(500).json({
        status: "FAILED",
        description: "Server Error",
      });
    }
  });





    app.post(PREFIX + "/enable", async (req, res) => {
    let email = req.body.email;
  
    let selectQuery = `
      SELECT pm_users.* 
      FROM pm_users
      WHERE pm_users.email = ? AND pm_users.email_verification_status = true AND pm_users.status = 'disabled'
    `;
  
    let enableQuery =
      "UPDATE pm_users SET status = 'active', updated_at = CURRENT_TIMESTAMP() WHERE email = ?";
  
    let results;
    try {
      [results] = await mysql_db.execute(selectQuery, [email]);
  
      if (results.length > 0) {
        // Disable the user
        await mysql_db.execute(enableQuery, [email]);
  
        return res.status(200).json({
          status: "SUCCESS",
          description: "User enabled successfully",
        });
      } else {
        return res.status(404).json({
          status: "FAILED",
          description: "User not found or already enabled",
        });
      }
    } catch (error) {
      console.log(error);
  
      return res.status(500).json({
        status: "FAILED",
        description: "Server Error",
      });
    }
  });



  // PUT: Update user information
  app.put(
    PREFIX + "/:user_id",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const { property_id, user_id } = req.params;
      const { dob, name, email, address, tel_number, country } = req.body;

      if (!dob || !name || !email || !address || !tel_number || !country) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: required fields are missing",
        });
      }

      try {
        const updateQuery = `
      UPDATE pm_users 
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
          user_id,
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
          description: "Successfully updated the user",
        });
      } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to update user",
        });
      }
    }
  );

  app.post(
    PREFIX + "/invite",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      let { full_name, email, countryCode, role } = req.body;
      const { site_id } = req.user;
      if (
        full_name.length === 0 ||
        full_name.length > 100 ||
        email.length === 0 ||
        !validateEmail(email)
      ) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid invitation information",
        });
      }

      // Check if the email already exists in pm_users
      let selectQuery = `SELECT * FROM pm_users WHERE email = ?`;
      let results;
      try {
        [results] = await mysql_db.execute(selectQuery, [email]);
      } catch (error) {
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error",
        });
      }

      if (results.length > 0) {
        return res.status(409).json({
          status: "FAILED",
          description: "User already exists",
        });
      }

      // Generate necessary fields
      let user_uuid = uuid();
      let email_verification_code = "VC-" + uuid();
      let stamp = moment().format("YYYY-MM-DD HH:mm:ss");

      // Get user agent and IP details
      var parser = new UAParser();
      var uastring3 = req.headers["user-agent"];
      parser.setUA(uastring3);
      var device = parser.getOS().name + " " + parser.getBrowser().name;
      var getClientAddress =
        (req.headers["x-forwarded-for"] || "").split(",")[0] ||
        req.connection.remoteAddress;

      var geo = geoip.lookup(getClientAddress);
      var country = null;

      if (!countryCode) {
        countryCode = geo?.country === undefined ? null : geo?.country;
        countryCode = !countryCode && "GHA"; // Default to Ghana if no country is detected
      }

      let user_type = role; // Specific for invited property managers

      bcrypt.hash("defaultPassword123", saltRounds, async (err, hash) => {
        if (err) {
          return res.status(500).json({
            status: "FAILED",
            description: "Password encryption error",
          });
        }

        const connection = await mysql_db.getConnection();
        try {
          await connection.beginTransaction();
          const insertedUser = {};

          // Insert into pm_users
          // currently invitation status will be set to 'pending'
          let insertUserQuery = `INSERT INTO pm_users 
              (uuid, name, email, password, user_type, email_verification_code, email_verification_status, country, site_id, invitation_status, created_at, updated_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?);`;
          
          const [result] = await connection.execute(insertUserQuery, [
              user_uuid,
              full_name,
              email,
              hash, // Hashed default password
              user_type,
              email_verification_code,
              false,
              countryCode,
              site_id,
              stamp,
              stamp,
          ]);
          
          // Store inserted user data
          insertedUser[result.insertId] = {
              email: email,
              fullName: full_name,
              user_type: user_type,
          };
          console.log('Inserted User:', insertedUser[result.insertId]);
          
          await connection.commit();

          // Send email invitation with verification code
          let invitationLink = `https://api.pm.proptios.com/verification-email/code/${email_verification_code}`;
          emailActivation(email, full_name, invitationLink);

          return res.status(200).json({
            data: insertedUser,
            status: "SUCCESS",
            description: "Invitation sent successfully",
          });
        } catch (error) {
          await connection.rollback(); // Rollback if there's an error
          console.log(error);
          return res.status(500).json({
            status: "FAILED",
            description: "Server Error during invitation",
          });
        } finally {
          connection.release();
        }
      });
    }
  );
};

module.exports = {
  routes,
};
