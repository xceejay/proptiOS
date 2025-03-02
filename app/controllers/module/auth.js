const neo4j_db = require("../../config/db"); // neo4j-db + OGM
const mysql_db = require("../../config/db.mysql"); // neo4j-db
const MH = require("../../config/security");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { UAParser } = require("ua-parser-js");
const uuid = require("uuid-random");
const dateFormat = require("dateformat");
const ECN = require("../../config/constants");
const includes = require("array-includes");
const shortid = require("shortid");
const axios = require("axios");
const numbro = require("numbro");
const multer = require("multer");
const upload = multer();
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

// Emails to be sent to pm_users via Postmark

const PREFIX = "/auth";
const saltRounds = 10;
const secret = "1234";
const jwtMiddleware = require("../../middleware/jwt");
const audit_log = require("../../middleware/audit_log");

const routes = (app) => {
  app.get(PREFIX + "/me", jwtMiddleware, async (req, res) => {
    try {
      let selectQuery = `SELECT * FROM pm_users WHERE id = ? and status != "disabled"`;
      let [results] = await mysql_db.execute(selectQuery, [req.user.id]);

      if (results.length === 0) {
        return res.status(403).json({
          status: "FAILED",
          description: "UNauthorized : User not found",
        });
      }

      let user = MH.Security.secureUser(results[0]);

      return res.status(200).json({
        status: "SUCCESS",
        description: "User data retrieved successfully",
        data: { user },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "FAILED",
        description: "Server Error",
      });
    }
  });

  // Login and Generate JWT token

  app.post(PREFIX + "/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  
    let selectQuery = `
      SELECT pm_users.*, 
      sites.site_name, sites.site_image_url, sites.currency, sites.subscription_id as site_subscription_id, sites.created_at AS site_created_at, sites.updated_at AS site_updated_at
      FROM pm_users
      JOIN sites ON pm_users.site_id = sites.id
      WHERE pm_users.email = ? AND pm_users.email_verification_status = true AND pm_users.status != 'disabled'
    `;
  
    let updateQuery = `
      UPDATE pm_users SET invitation_status = ?, status = ?, logged_in = CURRENT_TIMESTAMP() WHERE email = ?
    `;
  
    let logQuery = `
      INSERT INTO audit_logs (pm_user_id, action, user_action, table_name, uuid, response_description, request_body, ip_address, user_agent, status_code, endpoint, site_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?)
    `;
  
    let results;
    try {
      [results] = await mysql_db.execute(selectQuery, [email]);
  
      if (results.length > 0) {
        let hash = results[0].password;
        bcrypt.compare(password, hash, async function (err, result) {
          if (result) {
            // Update the login timestamp after successful authentication
            await mysql_db.execute(updateQuery, ["accepted", "active", email]);
  
            let sendToBrowser = MH.Security.secureUser(results[0]);
            const token = jwt.sign(sendToBrowser, secret, {
              expiresIn: "1d",
            });
  
            // Log the user login into the audit_logs table
            const logUUID = uuid(); // Generate a unique ID for the audit log
            let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
            if (ip.substr(0, 7) == "::ffff:") {
              ip = ip.substr(7); // Normalize IPv6 address
            }
  
            // Execute the audit log insert query
            try {
              await mysql_db.execute(logQuery, [
                results[0].id, // pm_user_id from the results
                "POST", // Action performed
                "Logged in", // Action performed
                "pm_users", // Table name
                logUUID, // Generated UUID
                "User Logged in",
                null, // Request body (can be null for login events)
                ip, // IP address
                req.headers["user-agent"], // User agent (browser information)
                200, // Status code (assumed successful login)
                fullUrl, // The endpoint accessed
                results[0].site_id, // Site ID associated with the user
              ]);
            } catch (logError) {
              console.error("Audit log error:", logError); // Log any errors with the audit log insert
            }
  
            // Send the response back to the client
            return res.status(200).json({
              status: "SUCCESS",
              description: "Logged In Successfully",
              data: {
                user: sendToBrowser,
                token: token,
              },
            });
          } else {
            return res.status(403).json({
              status: "FAILED",
              description: "Invalid Credentials",
            });
          }
        });
      } else {
        return res.status(403).json({
          status: "FAILED",
          description: "Invalid Credentials",
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
  

  // Verify Confirmation Email Code
  app.post(PREFIX + "/verify-email-code", async (req, res) => {
    let code = req.body.code;
    let query =
      "SELECT * FROM `pm_users` WHERE email_verification_code = ? AND email_verification_status = false";
    let results;
    try {
      [results] = await mysql_db.execute(query, [code]);
    } catch (error) {
      return res.status(403).json({
        status: "FAILED",
        description: "Server Error",
      });
    }

    if (results.length > 0) {
      let userEmail = results[0].email;
      let userFullname = results[0].name;
      let updateQuery =
        "UPDATE `pm_users` SET `email_verification_status` = 1, `invitation_status` = 'active' WHERE email_verification_code = ?;";

      try {
        await mysql_db.execute(updateQuery, [code]);
        welcomeEmail(userFullname, userEmail);
        return res.status(200).json({
          status: "SUCCESS",
          description: "Email verification successful",
        });
      } catch (error) {
        return res.status(403).json({
          status: "FAILED",
          description: "Server Error during email verification update",
        });
      }
    } else {
      return res.status(403).json({
        status: "FAILED",
        description: "Invalid or already confirmed code",
      });
    }
  });

  // Reset password
  app.post(PREFIX + "/reset-password", async (req, res) => {
    let resetToken = req.body.token;
    let password = req.body.password;
    if (resetToken.length === 0 || password.length === 0) {
      return res.status(403).json({
        status: "FAILED",
        description:
          "Invalid reset password information or password field is empty",
      });
    }

    let query =
      "SELECT * FROM `pm_users` WHERE reset_password_code = ? AND reset_password_code_status = false";
    let results;
    try {
      [results] = await mysql_db.execute(query, [resetToken]);
    } catch (error) {
      return res.status(403).json({
        status: "FAILED",
        description: "Server Error",
      });
    }

    if (results.length > 0) {
      var userPassword = results[0].password;
      bcrypt.compare(password, userPassword, async (err, result) => {
        if (result) {
          return res.status(403).json({
            status: "FAILED",
            description: "You can't use an old password",
          });
        }
        let updateQuery =
          "UPDATE `pm_users` SET `password` = ? WHERE reset_password_code = ?;";
        try {
          await mysql_db.execute(updateQuery, [bcrypt.hash(password, saltRounds), resetToken]);
          return res.status(200).json({
            status: "SUCCESS",
            description: "Password reset successful",
          });
        } catch (error) {
          return res.status(403).json({
            status: "FAILED",
            description: "Server Error during password update",
          });
        }
      });
    } else {
      return res.status(403).json({
        status: "FAILED",
        description: "Invalid reset token or password reset already processed",
      });
    }
  });

  // Resend Verification
  app.post(PREFIX + "/resend-verification", async (req, res) => {
    let user_uuid = req.body.user_uuid;
    var db = neo4j_db.get_instance();
    let query = "SELECT * FROM `pm_users` WHERE uuid = ?";
    let results;
    try {
      [results] = await mysql_db.execute(query, [user_uuid]);
    } catch (error) {
      return res.status(403).json({
        status: "FAILED",
        description: "Server Error",
      });
    }

    if (results.length > 0) {
      let userFullname = results[0].name;
      let userEmail = results[0].email;
      let email_verification_code = "VC-" + uuid();
      let updateQuery =
        "UPDATE `pm_users` SET `email_verification_code` = ? WHERE uuid = ?;";
      try {
        await mysql_db.execute(updateQuery, [
          email_verification_code,
          user_uuid,
        ]);
        emailActivation(
          userEmail,
          userFullname,
          `https://api.pm.proptios.com/verification-email/code/${email_verification_code}`
        );
        return res.status(200).json({
          status: "SUCCESS",
          description: "Verification code resent successfully",
        });
      } catch (error) {
        return res.status(403).json({
          status: "FAILED",
          description: "Server Error during code update",
        });
      }
    } else {
      return res.status(403).json({
        status: "FAILED",
        description: "Invalid user UUID or verification already confirmed",
      });
    }
  });

  // Forgot Password
  app.post(PREFIX + "/forgot-password", async (req, res) => {
    let email = req.body.email;
    // var db = neo4j_db.get_instance();
    let query = "SELECT * FROM `pm_users` WHERE email = ?";
    let results;
    try {
      [results] = await mysql_db.execute(query, [email]);
    } catch (error) {
      return res.status(403).json({
        status: "FAILED",
        description: "Server Error",
      });
    }

    if (results.length > 0) {
      let full_name = results[0].name;
      let newcode = "RP-" + uuid();
      let updateQuery =
        "UPDATE `pm_users` SET `reset_password_code` = ?, `reset_password_code_status` = false, `reset_password_code_stamp` = NOW() WHERE email = ?;";
      try {
        await mysql_db.execute(updateQuery, [newcode, email]);
        forgotPassword(
          email,
          full_name,
          `https://api.pm.proptios.com/reset-password/${newcode}`
        );
        return res.status(200).json({
          status: "SUCCESS",
          description: "Reset password link sent",
        });
      } catch (error) {
        return res.status(403).json({
          status: "FAILED",
          description: "Server Error during password reset request",
        });
      }
    } else {
      return res.status(403).json({
        status: "FAILED",
        description: "Email not found",
      });
    }
  });

  // Registration
  app.post(PREFIX + "/register", upload.single("id_card"), async (req, res) => {
    let full_name = trim(req.body.full_name);
    let email = trim(req.body.email);
    let password = trim(req.body.password);
    let site_name = trim(req.body.site_name ? req.body.site_name : "");
    let site_id = trim(req.body.site_id);
    let countryCode = trim(req.body.country);

    if (
      full_name.length === 0 ||
      full_name.length > 100 ||
      email.length === 0 ||
      !validateEmail(email) ||
      password.length === 0
    ) {
      return res.status(403).json({
        status: "FAILED",
        description: "Invalid registration information",
      });
    }

    let query = "SELECT * FROM `pm_users` WHERE email = ?";
    let results;
    try {
      [results] = await mysql_db.execute(query, [email]);
    } catch (error) {
      return res.status(403).json({
        status: "FAILED",
        description: "Server Error",
      });
    }

    if (results.length == 0) {
      let user_uuid = uuid();
      var parser = new UAParser();
      let email_verification_code = "VC-" + uuid();
      var uastring3 = req.headers["user-agent"];
      let stamp = moment().format("YYYY-MM-DD HH:mm:ss");
      parser.setUA(uastring3);
      var device = parser.getOS().name + " " + parser.getBrowser().name;
      var getClientAddress =
        (req.headers["x-forwarded-for"] || "").split(",")[0] ||
        req.connection.remoteAddress;

      var geo = geoip.lookup(getClientAddress);
      var country = null;

      if (!countryCode) {
        countryCode = geo?.country === undefined ? null : geo?.country;
        countryCode = !countryCode && "GHA";
        if (countryCode != null) {
          var obj = lookup.byIso(countryCode);
          country = obj.country;
        }
      }

      let user_type = "property_owner";

      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          return res.status(500).json({
            status: "FAILED",
            description: "Password encryption error",
          });
        }
        password = hash;

        const connection = await mysql_db.getConnection();
        try {
          await connection.beginTransaction();

          // Insert into `sites`
          let insertSiteQuery = `INSERT INTO sites (site_name, site_subdomain, id, status) VALUES (?, ?, ?, 'active');`;
          await connection.execute(insertSiteQuery, [
            site_name,
            site_name,
            site_id,
          ]);

          // Insert into `pm_users`
          let insertQuery = `INSERT INTO pm_users (uuid, name, email, password, user_type, email_verification_code, email_verification_status, country, site_id, created_at, updated_at) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
          await connection.execute(insertQuery, [
            user_uuid,
            full_name,
            email,
            password,
            user_type,
            email_verification_code,
            false,
            countryCode,
            site_id,
            stamp,
            stamp,
          ]);

          await connection.commit(); // Commit the transaction

          emailActivation(
            email,
            full_name,
            `https://api.pm.proptios.com/verification-email/code/${email_verification_code}`
          );

          return res.status(200).json({
            status: "SUCCESS",
            description: "Registration successful, verification email sent",
          });
        } catch (error) {
          await connection.rollback(); // Rollback the transaction in case of any error
          console.log(error);
          return res.status(500).json({
            status: "FAILED",
            description: "Server Error during registration",
          });
        } finally {
          connection.release(); // Release the connection
        }
      });
    } else {
      return res.status(409).json({
        status: "FAILED",
        description: "Email already exists with this site",
      });
    }
  });
};

module.exports = {
  routes,
};
