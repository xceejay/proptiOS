
const mysql_db = require("../config/db.mysql");
const uuid = require("uuid-random");

const acl = (allowedRoles) => {
  return async (req, res, next) => {
    // Step 1: Check if req.user contains necessary information
    if (!req.user || !req.user.id || !req.user.site_id || !req.user.user_type) {
      console.error("Missing user information in request");
      return res.status(401).json({
        status: "FAILED",
        description: "Unauthorized Access: Missing user information",
      });
    }

    // Step 2: Verify property access in the database
    const query = `
      SELECT * FROM pm_users 
      WHERE id = ? AND site_id = ? AND status != 'disabled'
    `;
    try {
      const [results] = await mysql_db.execute(query, [
        req.user.id,
        req.user.site_id,
      ]);

      if (results.length === 0) {
        console.log("User not found or unauthorized access attempt");
        return res.status(403).json({
          status: "FAILED",
          description: "Unauthorized Access: You do not have property access",
        });
      }
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        status: "FAILED",
        description: "Server Error: Unable to verify property access",
      });
    }

    // Step 3: Verify user_type authorization
    if (!allowedRoles.includes(req.user.user_type)) {
      console.log("User user_type is not authorized to access this endpoint");
      return res.status(405).json({
        status: "FAILED",
        description:
          "Forbidden: Your user_type does not have access to this endpoint",
      });
    }

    // Intercept the response for logging/auditing purposes
    const originalSend = res.send;
    res.send = async function (body) {
      // For GET requests, simply send the response without calling next()
      if (req.method === "GET") {
        return originalSend.call(this, body);
      }

      // Determine table name and user action (logging details)
      let tableName = null;
      const fullUrl = req.originalUrl.split("?")[0]; // Clean URL
      const routePrefix = fullUrl.split("/")[1];

      switch (routePrefix) {
        case "users":
          tableName = "pm_users";
          break;
        case "audit":
          return originalSend.call(this, body);
        case "site":
          tableName = "sites";
          break;
        default:
          tableName = routePrefix;
      }

      let userAction;
      switch (req.method) {
        case "GET":
          userAction = "Viewed";
          break;
        case "POST":
          userAction = "Created";
          break;
        case "PUT":
        case "PATCH":
          userAction = "Updated";
          break;
        case "DELETE":
          userAction = "Deleted";
          break;
        default:
          userAction = req.method;
      }

      const logUUID = uuid();

      let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      if (ip && ip.startsWith("::ffff:")) {
        ip = ip.substr(7);
      }

      let responseDescription = null;
      if (typeof body === "string") {
        try {
          const parsedBody = JSON.parse(body);
          responseDescription = parsedBody.description || null;
        } catch (e) {
          responseDescription = null;
        }
      } else if (typeof body === "object") {
        responseDescription = body.description || null;
      }

      // Build a human-readable audit summary
      const userName = req.user.name || req.user.email || "A user";
      const entityLabels = {
        pm_users: "user",
        tenants: "tenant",
        properties: "property",
        units: "unit",
        leases: "lease",
        maintenance: "maintenance request",
        sites: "site settings",
        transactions: "transaction",
        settlements: "settlement",
      };
      const entityLabel = entityLabels[tableName] || tableName;
      const actionLabels = {
        Created: "created a new",
        Updated: "updated a",
        Deleted: "deleted a",
      };
      const actionLabel = actionLabels[userAction];
      if (actionLabel && res.statusCode >= 200 && res.statusCode < 300) {
        responseDescription = `${userName} ${actionLabel} ${entityLabel}`;
      } else if (res.statusCode >= 400) {
        responseDescription =
          responseDescription || `Failed to ${userAction.toLowerCase()} ${entityLabel}`;
      }

      const logQuery = `
        INSERT INTO audit_logs (pm_user_id, action, table_name, uuid, request_body, response_body, ip_address, user_agent, status_code, endpoint, response_description, site_id, user_action)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      try {
        await mysql_db.execute(logQuery, [
          req.user.id,
          req.method,
          tableName,
          logUUID,
          null,
          null,
          ip,
          req.headers["user-agent"],
          res.statusCode,
          fullUrl,
          responseDescription,
          req.user.site_id,
          userAction,
        ]);
      } catch (logError) {
        console.error("Audit log error:", logError);
      }

      // Finally, send the response
      originalSend.call(this, body);
    };

    // Proceed to the next middleware/endpoint
    next();
  };
};

module.exports = acl;

