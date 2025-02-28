const mysql_db = require("../config/db.mysql");
const uuid = require("uuid-random");

const audit_log = () => {
  return async (req, res, next) => {
    // Step 1: Check if req.user contains necessary information

    // Dynamically set the table name based on the route prefix without URL params
    let tableName = null;
    const fullUrl = req.originalUrl.split("?")[0]; // Remove URL parameters

    const routePrefix = fullUrl.split("/")[1]; // Extract route prefix from cleaned URL

    switch (routePrefix) {
      case "users":
        tableName = "pm_users"; // Special case for pm_users
        break;
      case "audit":
        tableName = "audit_logs"; // Special case for pm_users
        break;
      case "site":
        tableName = "sites"; // Special case for sites
        break;
      default:
        tableName = "sites"; // Default to route prefix as table name
    }

    // Intercept the response and log it
    const originalSend = res.send;

    res.send = async function (body) {
      const logUUID = uuid(); // Generate a UUID using uuid-random

      let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      if (ip.substr(0, 7) == "::ffff:") {
        ip = ip.substr(7);
      }

      // Extract response description from the body
      let responseDescription = null;
      if (typeof body === "string") {
        try {
          const parsedBody = JSON.parse(body); // Parse JSON string if response is a string
          responseDescription = parsedBody.description || null;
        } catch (e) {
          responseDescription = null; // Handle non-JSON responses
        }
      } else if (typeof body === "object") {
        responseDescription = body.description || null; // Directly access if it's already an object
      }

      const logQuery = `
        INSERT INTO audit_logs (pm_user_id, action, table_name, uuid, request_body, response_body, ip_address, user_agent, status_code, endpoint, response_description, site_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Log audit data
      try {
        await mysql_db.execute(logQuery, [
          req.user.id, // pm_user_id
          req.method, // action (HTTP method)
          tableName, // Cleaned route prefix as table_name
          logUUID, // Generated UUID
          null, //log null bodies for now due to performance issues
          null,
          // JSON.stringify(req.body), // request_body
          // JSON.stringify(body), // response_body
          ip, // ip_address
          req.headers["user-agent"], // user_agent
          res.statusCode, // status_code
          fullUrl, // Cleaned URL without parameters
          responseDescription, // User-friendly response description from the response body
          req.user.site_id, // site_id
        ]);
      } catch (logError) {
        console.error("Audit log error:", logError);
      }

      // Proceed with sending the response
      originalSend.call(this, body);
    };

    // If both checks are successful, proceed to the next middleware or endpoint handler
    return next();
  };
};

module.exports = audit_log;
