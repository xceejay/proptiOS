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
    PREFIX + "/:property_id/listings",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const property_id = req.params.property_id;
      const { listing_url } = req.body;

      if (!listing_url || !property_id) {
        return res.status(400).json({
          status: "FAILED",
          description:
            "Invalid input: listing_url and property_id are required",
        });
      }

      try {
        const insertQuery =
          "INSERT INTO listings (listing_url, property_id) VALUES (?, ?)";
        await mysql_db.execute(insertQuery, [listing_url, property_id]);

        return res.status(200).json({
          status: "SUCCESS",
          description: "Successfully added the listing",
        });
      } catch (error) {
        console.error("Error adding listing:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to add listing",
        });
      }
    }
  );

  app.put(
    PREFIX + "/:property_id/listings/:id",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const property_id = req.params.property_id;
      const listing_id = req.params.id;
      const { listing_url } = req.body;

      if (!listing_url || !property_id || !listing_id) {
        return res.status(400).json({
          status: "FAILED",
          description:
            "Invalid input: listing_url, property_id, and id are required",
        });
      }

      try {
        const updateQuery =
          "UPDATE listings SET listing_url = ?, updated_at = NOW() WHERE id = ? AND property_id = ?";
        const [result] = await mysql_db.execute(updateQuery, [
          listing_url,
          listing_id,
          property_id,
        ]);

        if (result.affectedRows === 0) {
          return res.status(200).json({
            data: [],
            status: "NO_RES",
            description: "Listing not found",
          });
        }

        return res.status(200).json({
          status: "SUCCESS",
          description: "Successfully updated the listing",
        });
      } catch (error) {
        console.error("Error updating listing:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to update listing",
        });
      }
    }
  );

  app.get(
    PREFIX + "/:property_id/listings",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const property_id = req.params.property_id;

      try {
        const selectQuery = "SELECT * FROM listings WHERE property_id = ?";
        const [results] = await mysql_db.execute(selectQuery, [property_id]);

        return res.status(200).json({
          status: "SUCCESS",
          data: results,
        });
      } catch (error) {
        console.error("Error fetching listings:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch listings",
        });
      }
    }
  );

  app.get(
    PREFIX + "/:property_id/listings/:page/:limit",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    propertyAccessChecks,
    async (req, res) => {
      const property_id = req.params.property_id;
      const page = Math.max(parseInt(req.query.page) || 1, 1); // Default to 1 if not a valid number
      const limit = Math.max(parseInt(req.query.limit) || 10, 1); // Default to 10 if not a valid number
      const offset = (page - 1) * limit; //set the offset

      try {
        const totalQuery =
          "SELECT COUNT(*) AS total FROM listings WHERE property_id = ?";
        const [totalResults] = await mysql_db.execute(totalQuery, [
          property_id,
        ]);
        const totalListings = totalResults[0]?.total || 0;
        const totalPages = Math.ceil(totalListings / limit);

        const selectQuery =
          "SELECT * FROM listings WHERE property_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
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
            totalListings,
            totalPages,
            items: results,
          },
        });
      } catch (error) {
        console.error("Error fetching listings:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch listings",
        });
      }
    }
  );
};

module.exports = {
  routes,
};
