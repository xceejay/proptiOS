const neo4j_db = require("../../config/db"); // neo4j-db + OGM
const mysql_db = require("../../config/db.mysql"); // neo4j-db
const JOD = require("../../config/security");
const bcrypt = require("bcryptjs");
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

const propertyAccessChecks = require("../../middleware/acl");

// Emails to be sent to users via Postmark

const PREFIX = "/audit";
const saltRounds = 10;
const secret = "mysecretsshhh";

const routes = (app) => {
  app.get(
    PREFIX + "logs",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    async (req, res) => {
      let page = parseInt(req.query.page);
      let limit = parseInt(req.query.limit);

      const paginationEnabled =
        !isNaN(page) && !isNaN(limit) && page > 0 && limit > 0;

      if (paginationEnabled) {
        page = Math.max(page, 1);
        limit = Math.max(limit, 1);
      }

      try {
        // Count the total number of audit logs for pagination or to get all logs
        const countQuery = `
              SELECT COUNT(*) AS totalAuditLogs
              FROM audit_logs
              WHERE site_id = ? AND deleted_at IS NULL
            `;
        const [countResult] = await mysql_db.execute(countQuery, [
          req.user.site_id,
        ]);
        const totalAuditLogs = countResult[0].totalAuditLogs;

        let selectQuery;
        let queryParams;

        if (paginationEnabled) {
          const offset = (page - 1) * limit;
          selectQuery = `
                SELECT 
                  audit_logs.id,
                  audit_logs.timestamp,
                  audit_logs.pm_user_id,
                  audit_logs.action,
                  audit_logs.user_action,
                  audit_logs.table_name,
                  audit_logs.uuid,
                  audit_logs.request_body,
                  audit_logs.response_body,
                  audit_logs.old_value,
                  audit_logs.new_value,
                  audit_logs.ip_address,
                  audit_logs.user_agent,
                  audit_logs.status_code,
                  audit_logs.endpoint,
                  audit_logs.response_description,
                  audit_logs.site_id,
                  pm_users.name AS pm_user_name,
                  pm_users.email AS pm_user_email
                FROM audit_logs
                LEFT JOIN pm_users ON audit_logs.pm_user_id = pm_users.id
                WHERE audit_logs.site_id = ? AND audit_logs.deleted_at IS NULL
                ORDER BY audit_logs.timestamp DESC
                LIMIT ? OFFSET ?
              `;
          queryParams = [req.user.site_id, limit, offset];
        } else {
          // If pagination is not enabled, return all audit logs without LIMIT and OFFSET
          selectQuery = `
                SELECT 
                  audit_logs.id,
                  audit_logs.timestamp,
                  audit_logs.pm_user_id,
                  audit_logs.action,
                  audit_logs.user_action,
                  audit_logs.table_name,
                  audit_logs.uuid,
                  audit_logs.request_body,
                  audit_logs.response_body,
                  audit_logs.old_value,
                  audit_logs.new_value,
                  audit_logs.ip_address,
                  audit_logs.user_agent,
                  audit_logs.status_code,
                  audit_logs.endpoint,
                  audit_logs.response_description,
                  audit_logs.site_id,
                  pm_users.name AS pm_user_name,
                  pm_users.email AS pm_user_email
                FROM audit_logs
                LEFT JOIN pm_users ON audit_logs.pm_user_id = pm_users.id
                WHERE audit_logs.site_id = ? AND audit_logs.deleted_at IS NULL
                ORDER BY audit_logs.timestamp DESC
              `;
          queryParams = [req.user.site_id];
        }

        const [results] = await mysql_db.execute(selectQuery, queryParams);

        if (results.length === 0) {
          return res.status(200).json({
            status: "NO_RES",
            data: {},
            description: "No audit logs found",
          });
        }

        const response = {
          status: "SUCCESS",
          data: {
            totalAuditLogs,
            items: results.map((row) => ({
              id: row.id,
              timestamp: row.timestamp,
              action: row.action,
              user_action: row.user_action,
              table_name: row.table_name,
              uuid: row.uuid,
              request_body: row.request_body,
              response_body: row.response_body,
              old_value: row.old_value,
              new_value: row.new_value,
              ip_address: row.ip_address,
              user_agent: row.user_agent,
              status_code: row.status_code,
              endpoint: row.endpoint,
              response_description: row.response_description,
              site_id: row.site_id,
              pm_user: {
                id: row.pm_user_id,
                name: row.pm_user_name,
                email: row.pm_user_email,
              },
            })),
          },
          description: "Successfully retrieved audit logs",
        };

        if (paginationEnabled) {
          const totalPages = Math.ceil(totalAuditLogs / limit);
          response.data.page = page;
          response.data.limit = limit;
          response.data.totalPages = totalPages;
        }

        return res.status(200).json(response);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch audit logs",
        });
      }
    }
  );
};

module.exports = {
  routes,
};

