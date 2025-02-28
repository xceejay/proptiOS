const neo4j_db = require("../../config/db"); // neo4j-db + OGM
const mysql_db = require("../../config/db.mysql"); // neo4j-db
const JOD = require("../../config/security");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { UAParser } = require("ua-parser-js");
var uuid = require("uuid-random");
var dateFormat = require("dateformat");
var ECN = require("../../config/constants");
var includes = require("array-includes");
const shortid = require("shortid");
const axios = require("axios");
const numbro = require("numbro");
const geoip = require("geoip-lite");
const lookup = require("country-code-lookup");
const { client, xml, jid } = require("@xmpp/client");
const debug = require("@xmpp/debug");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet(
  "123456789AbcDeFkLPzZQqRrMmNWwBEGgHhJSTtUuXx",
  32
);
const nanoid_short = customAlphabet(
  "123456789AbcDeFkLPzZQqRrMmNWwBEGgHhJSTtUuXx",
  8
);
const nanoid_shortest = customAlphabet(
  "123456789AbcDeFkLPzZQqRrMmNWwBEGgHhJSTtUuXx",
  5
);

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
const jwtMiddleware = require("../../middleware/jwt");
const acl = require("../../middleware/acl");

const propertyAccessChecks = require("../../middleware/property_access");

// Emails to be sent to users via Postmark

const PREFIX = "/site";
const saltRounds = 10;
const secret = "mysecretsshhh";

const routes = (app) => {
  app.post(
    PREFIX + "/:property_id/maintenance_requests",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const property_id = req.params.property_id;
      const { media_type, media_url, request_owner, unit_id, pm_user_id } =
        req.body;

      if (!media_type || !request_owner) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: required fields are missing",
        });
      }

      try {
        const insertQuery = `
            INSERT INTO maintenance_requests (media_type, media_url, request_owner, unit_id, property_id, pm_user_id) 
            VALUES (?, ?, ?, ?, ?, ?)
          `;
        await mysql_db.execute(insertQuery, [
          media_type,
          media_url,
          request_owner,
          unit_id,
          property_id,
          pm_user_id,
        ]);

        return res.status(200).json({
          status: "SUCCESS",
          description: "Successfully added the maintenance request",
        });
      } catch (error) {
        console.error("Error adding maintenance request:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to add maintenance request",
        });
      }
    }
  );

  // PUT: Update an existing maintenance request
  app.put(
    PREFIX + "/:property_id/maintenance_requests/:id",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const request_id = req.params.id;
      const { media_type, media_url, request_owner, unit_id, pm_user_id } =
        req.body;

      if (!media_type || !request_owner) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: required fields are missing",
        });
      }

      try {
        const updateQuery = `
            UPDATE maintenance_requests 
            SET media_type = ?, media_url = ?, request_owner = ?, unit_id = ?, pm_user_id = ?, updated_at = NOW() 
            WHERE id = ?
          `;
        const [result] = await mysql_db.execute(updateQuery, [
          media_type,
          media_url,
          request_owner,
          unit_id,
          pm_user_id,
          request_id,
        ]);

        if (result.affectedRows === 0) {
          return res.status(200).json({
            data: [],
            status: "NO_RES",
            description: "Maintenance request not found",
          });
        }

        return res.status(200).json({
          status: "SUCCESS",
          description: "Successfully updated the maintenance request",
        });
      } catch (error) {
        console.error("Error updating maintenance request:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to update maintenance request",
        });
      }
    }
  );

  // GET: Retrieve maintenance requests with pagination
  app.get(
    PREFIX + "/:property_id/maintenance_requests/:page/:limit",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const property_id = req.params.property_id;
      const page = Math.max(parseInt(req.query.page) || 1, 1); // Default to 1 if not a valid number
      const limit = Math.max(parseInt(req.query.limit) || 10, 1); // Default to 10 if not a valid number
      const offset = (page - 1) * limit;

      try {
        const totalQuery =
          "SELECT COUNT(*) AS total FROM maintenance_requests WHERE property_id = ?";
        const [totalResults] = await mysql_db.execute(totalQuery, [
          property_id,
        ]);
        const totalRequests = totalResults[0]?.total || 0;
        const totalPages = Math.ceil(totalRequests / limit);

        const selectQuery = `
            SELECT id, media_type, media_url, request_owner, unit_id, pm_user_id, created_at, updated_at 
            FROM maintenance_requests 
            WHERE property_id = ? 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
          `;
        const [results] = await mysql_db.execute(selectQuery, [
          property_id,
          limit,
          offset,
        ]);

        return res.status(200).json({
          status: "SUCCESS",
          data: {
            page,
            limit,
            totalRequests,
            totalPages,
            items: results,
          },
        });
      } catch (error) {
        console.error("Error fetching maintenance requests:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch maintenance requests",
        });
      }
    }
  );
};

module.exports = {
  routes,
};
