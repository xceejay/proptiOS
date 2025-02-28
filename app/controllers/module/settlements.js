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

const propertyAccessChecks = require("../../middleware/acl");

// Emails to be sent to users via Postmark

const PREFIX = "/settlements";
const saltRounds = 10;
const secret = "mysecretsshhh";

const routes = (app) => {
  app.get(
    PREFIX + "/all",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
  
    async (req, res) => {
      const { site_id } = req.user;
  
      try {
        const selectQuery = `
          SELECT
              -- Settlement Account Fields
              settlement_accounts.id AS account_id,
              settlement_accounts.uuid AS account_uuid,
              settlement_accounts.account_type AS account_type,
              settlement_accounts.bank_account_holder_name AS account_holder_name,
              settlement_accounts.bank_name AS bank_name,
              settlement_accounts.bank_account_number AS bank_account_number,
              settlement_accounts.bank_account_swift_code AS bank_account_swift_code,
              settlement_accounts.country AS country,
              settlement_accounts.card_holder_name AS card_holder_name,
              settlement_accounts.card_number AS card_number,
              settlement_accounts.mobile_money_provider AS mobile_money_provider,
              settlement_accounts.msisdn AS mobile_money_number,
              settlement_accounts.currency AS account_currency,
              settlement_accounts.settlement_frequency AS account_frequency,
              settlement_accounts.status AS account_status,
              settlement_accounts.primary_account AS primary_account,
              settlement_accounts.verification_status AS account_verification_status,
  
              -- Settlement History Fields
              settlement_history.id AS history_id,
              settlement_history.amount AS settlement_amount,
              settlement_history.currency AS history_currency,
              settlement_history.status AS history_status,
              settlement_history.settlement_date AS history_settlement_date,
              settlement_history.settlement_reference AS history_reference,
  
              -- Settlement Preferences Fields
              settlement_preferences.id AS preference_id,
              settlement_preferences.frequency AS preference_frequency,
  
              -- Sites Fields
              sites.balance AS site_balance,
              sites.currency AS site_currency

  
          FROM
              settlement_accounts
          LEFT JOIN settlement_history ON settlement_history.settlement_account_id = settlement_accounts.id
          LEFT JOIN settlement_preferences ON settlement_preferences.site_id = settlement_accounts.site_id
          LEFT JOIN sites ON sites.id = settlement_accounts.site_id
          WHERE 
              settlement_accounts.site_id = ?;
        `;
  
        const [results] = await mysql_db.execute(selectQuery, [site_id]);
  
        if (results.length === 0) {
          return res.status(404).json({
            status: "FAILED",
            description: "No settlement information found for the site",
          });
        }
  
        // Initialize structures to hold segmented data
        const settlementAccounts = new Map();
        const settlementHistory = [];
        const settlementPreferences = {};
        let siteBalance = 0.00;
        let siteCurrency = null;

  
        results.forEach((row) => {
          // Populate settlement accounts (group by account_id)
          if (row.account_id && !settlementAccounts.has(row.account_id)) {
            settlementAccounts.set(row.account_id, {
              id: row.account_id,
              uuid: row.account_uuid,
              type: row.account_type,
              holder_name: row.account_holder_name || row.card_holder_name,
              bank_name: row.bank_name,
              bank_account_number: row.bank_account_number,
              bank_account_swift_code: row.bank_account_swift_code,
              country: row.country,
              card_number: row.card_number,
              mobile_money_provider: row.mobile_money_provider,
              msisdn: row.mobile_money_number,
              currency: row.account_currency,
              frequency: row.account_frequency,
              status: row.account_status,
              primary: row.primary_account,
              verification_status: row.account_verification_status,
            });
          }
  
          // Populate settlement history
          if (row.history_id) {
            settlementHistory.push({
              id: row.history_id,
              amount: row.settlement_amount,
              currency: row.history_currency,
              status: row.history_status,
              date: row.history_settlement_date,
              reference: row.history_reference,
            });
          }
  
          // Populate settlement preferences (only one entry for the site)
          if (!settlementPreferences.id) {
            settlementPreferences.id = row.preference_id;
            settlementPreferences.frequency = row.preference_frequency;
          }
  
          // Get the balance from the site
          if (row.site_balance !== null && siteBalance === null) {
            siteBalance = row.site_balance;
          }

          if (row.site_currency !== null && siteCurrency === null) {
            siteCurrency = row.site_currency;
          }
        });
  
        return res.status(200).json({
          status: "SUCCESS",
          data: {
            accounts: Array.from(settlementAccounts.values()), // Settlement Accounts
            history: settlementHistory, // Settlement History
            preferences: settlementPreferences, // Settlement Preferences
            currency: siteCurrency, // Site Currency
            balance:  parseFloat(siteBalance).toFixed(2), // Site Balance

          },
        });
      } catch (error) {
        console.error("Error fetching settlement data:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch settlement data",
        });
      }
    }
  );
  
  

  app.get(
    PREFIX + "/accounts",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    async (req, res) => {
      try {
        // Fetch all settlements for the site
        const selectQuery = `
              SELECT 
                settlement_accounts.id,
                settlement_accounts.pm_user_id,
                settlement_accounts.account_type,
                settlement_accounts.bank_account_holder_name,
                settlement_accounts.bank_name,
                settlement_accounts.branch_code,
                settlement_accounts.bank_account_number,
                settlement_accounts.card_holder_name,
                settlement_accounts.card_number,
                settlement_accounts.card_expiry_date,
                settlement_accounts.mobile_money_provider,
                settlement_accounts.msisdn,
                settlement_accounts.currency,
                settlement_accounts.settlement_frequency,
                settlement_accounts.status,
                settlement_accounts.created_at,
                settlement_accounts.updated_at,
                pm_users.name AS pm_user_name
              FROM settlement_accounts
              LEFT JOIN pm_users ON settlement_accounts.pm_user_id = pm_users.id
              WHERE settlement_accounts.site_id = ? AND settlement_accounts.status = 'active'
            `;

        const [results] = await mysql_db.execute(selectQuery, [
          req.user.site_id,
        ]);

        if (results.length === 0) {
          return res.status(200).json({
            data: {},
            status: "NO_RES",
            description: "No settlements found",
          });
        }

        return res.status(200).json({
          status: "SUCCESS",
          data: results,
        });
      } catch (error) {
        console.error("Error fetching settlements:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch settlements",
        });
      }
    }
  );
  app.post(
    PREFIX + "/accounts",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    async (req, res) => {
      const settlements = req.body;

      if (!Array.isArray(settlements) || settlements.length === 0) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: expected an array of settlement objects",
        });
      }

      const siteId = settlements[0].site_id; // Assuming all settlements are for the same site

      // Validate that the site only has one bank account or one mobile money account
      const checkQuery = `
            SELECT COUNT(*) AS bank_count, 
                   SUM(account_type = 'mobile_money') AS mobile_money_count
            FROM settlement_accounts
            WHERE site_id = ? AND status = 'active'
          `;

      const [existingCounts] = await mysql_db.execute(checkQuery, [siteId]);

      const existingBankAccounts = existingCounts[0].bank_count;
      const existingMobileMoneyAccounts = existingCounts[0].mobile_money_count;

      let newBankAccounts = 0;
      let newMobileMoneyAccounts = 0;

      // Check new settlements for their types
      for (const settlement of settlements) {
        if (settlement.account_type === "bank_account") newBankAccounts++;
        if (settlement.account_type === "mobile_money")
          newMobileMoneyAccounts++;
      }

      // Ensure that we do not exceed the limit of one bank account and one mobile money account
      if (
        existingBankAccounts + newBankAccounts > 1 ||
        existingMobileMoneyAccounts + newMobileMoneyAccounts > 1
      ) {
        return res.status(400).json({
          status: "FAILED",
          description:
            "Each site can only have one bank account or one mobile money account, or one of each",
        });
      }

      const connection = await mysql_db.getConnection(); // Get a connection from the pool

      try {
        await connection.beginTransaction(); // Start the transaction

        const insertedSettlements = []; // Array to store the inserted settlement's IDs

        for (const settlement of settlements) {
          const uuidValue = uuid(); // Generate a new UUID for each settlement

          const insertQuery = `
                INSERT INTO settlement_accounts (
                  uuid, pm_user_id, site_id, account_type, bank_account_holder_name, bank_name, 
                  branch_code, bank_account_number, card_holder_name, card_number, card_expiry_date, 
                  mobile_money_provider, msisdn, currency, settlement_frequency, status, created_at, 
                  updated_at, primary_account, bank_account_swift_code, verification_status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `;

          const values = [
            uuidValue,
            settlement.pm_user_id,
            settlement.site_id,
            settlement.account_type,
            settlement.bank_account_holder_name || null,
            settlement.bank_name || null,
            settlement.branch_code || null,
            settlement.bank_account_number || null,
            settlement.card_holder_name || null,
            settlement.card_number || null,
            settlement.card_expiry_date || null,
            settlement.mobile_money_provider || null,
            settlement.msisdn || null,
            settlement.currency,
            settlement.settlement_frequency,
            "active", // Default status to 'active'
            moment().format("YYYY-MM-DD HH:mm:ss"), // created_at
            moment().format("YYYY-MM-DD HH:mm:ss"), // updated_at
            settlement.primary_account || 0,
            settlement.bank_account_swift_code || null,
            settlement.verification_status || "pending_verification",
          ];

          const [result] = await connection.query(insertQuery, values); // Insert each settlement one by one

          insertedSettlements.push({
            id: result.insertId.toString(),
            pm_user_id: settlement.pm_user_id,
          });
        }

        await connection.commit(); // Commit the transaction if all inserts are successful

        return res.status(201).json({
          status: "SUCCESS",
          description: `Successfully inserted ${settlements.length} settlement(s)`,
          data: insertedSettlements, // Return the array of inserted settlements' IDs
        });
      } catch (error) {
        await connection.rollback(); // Rollback the transaction in case of error
        console.error("Error inserting settlements:", error);

        if (error.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            status: "FAILED",
            description:
              "Duplicate entry: one or more settlements already exist for the same user or site",
          });
        }

        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to insert settlements",
        });
      } finally {
        connection.release(); // Release the connection back to the pool
      }
    }
  );

  app.put(
    PREFIX + "/accounts",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    async (req, res) => {
      const settlements = req.body;

      if (!Array.isArray(settlements) || settlements.length === 0) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: expected an array of settlement objects",
        });
      }

      const siteId = settlements[0].site_id; // Assuming all settlements are for the same site

      // Validate that the site only has one bank account or one mobile money account
      const checkQuery = `
            SELECT COUNT(*) AS bank_count, 
                   SUM(account_type = 'mobile_money') AS mobile_money_count
            FROM settlement_accounts
            WHERE site_id = ? AND status = 'active'
          `;

      const [existingCounts] = await mysql_db.execute(checkQuery, [siteId]);

      const existingBankAccounts = existingCounts[0].bank_count;
      const existingMobileMoneyAccounts = existingCounts[0].mobile_money_count;

      let newBankAccounts = 0;
      let newMobileMoneyAccounts = 0;

      // Check new settlements for their types
      for (const settlement of settlements) {
        if (settlement.account_type === "bank_account") newBankAccounts++;
        if (settlement.account_type === "mobile_money")
          newMobileMoneyAccounts++;
      }

      // Ensure that we do not exceed the limit of one bank account and one mobile money account
      if (
        existingBankAccounts + newBankAccounts > 1 ||
        existingMobileMoneyAccounts + newMobileMoneyAccounts > 1
      ) {
        return res.status(400).json({
          status: "FAILED",
          description:
            "Each site can only have one bank account or one mobile money account, or one of each",
        });
      }

      const connection = await mysql_db.getConnection(); // Get a connection from the pool

      try {
        await connection.beginTransaction(); // Start the transaction

        for (const settlement of settlements) {
          const {
            id,
            account_type,
            bank_account_holder_name,
            bank_name,
            branch_code,
            bank_account_number,
            card_holder_name,
            card_number,
            card_expiry_date,
            mobile_money_provider,
            msisdn,
            currency,
            settlement_frequency,
            status,
            primary_account,
            bank_account_swift_code,
            verification_status,
          } = settlement;

          if (!id || !account_type || !currency || !settlement_frequency) {
            return res.status(400).json({
              status: "FAILED",
              description: `Invalid input: Missing required fields for settlement with ID ${id}`,
            });
          }

          const updateQuery = `
                UPDATE settlement_accounts
                SET
                  account_type = ?,
                  bank_account_holder_name = ?,
                  bank_name = ?,
                  branch_code = ?,
                  bank_account_number = ?,
                  card_holder_name = ?,
                  card_number = ?,
                  card_expiry_date = ?,
                  mobile_money_provider = ?,
                  msisdn = ?,
                  currency = ?,
                  settlement_frequency = ?,
                  status = ?,
                  primary_account = ?,
                  bank_account_swift_code = ?,
                  verification_status = ?,
                  updated_at = ?
                WHERE id = ? AND site_id = ?
              `;

          const values = [
            account_type,
            bank_account_holder_name || null,
            bank_name || null,
            branch_code || null,
            bank_account_number || null,
            card_holder_name || null,
            card_number || null,
            card_expiry_date || null,
            mobile_money_provider || null,
            msisdn || null,
            currency,
            settlement_frequency,
            status || "inactive",
            primary_account || 0,
            bank_account_swift_code || null,
            verification_status || "pending_verification",
            moment().format("YYYY-MM-DD HH:mm:ss"),
            id,
            siteId,
          ];

          const [result] = await connection.query(updateQuery, values);

          if (result.affectedRows === 0) {
            return res.status(404).json({
              status: "FAILED",
              description: `No settlement account found with ID ${id}`,
            });
          }
        }

        await connection.commit(); // Commit the transaction

        return res.status(200).json({
          status: "SUCCESS",
          description: `Successfully updated ${settlements.length} settlement(s)`,
        });
      } catch (error) {
        await connection.rollback(); // Rollback the transaction in case of error
        console.error("Error updating settlements:", error);

        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to update settlements",
        });
      } finally {
        connection.release(); // Release the connection back to the pool
      }
    }
  );

  app.put(
    PREFIX + "/accounts" + "/:id",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    async (req, res) => {
      const settlementId = req.params.id;
      const {
        account_type,
        bank_account_holder_name,
        bank_name,
        branch_code,
        bank_account_number,
        card_holder_name,
        card_number,
        card_expiry_date,
        mobile_money_provider,
        msisdn,
        currency,
        settlement_frequency,
        status,
        primary_account,
        bank_account_swift_code,
        verification_status,
        site_id,
      } = req.body;

      if (!settlementId) {
        return res.status(400).json({
          status: "FAILED",
          description: "Settlement ID is required",
        });
      }

      // Validate required fields
      if (!account_type || !currency || !settlement_frequency) {
        return res.status(400).json({
          status: "FAILED",
          description:
            "Missing required fields: account_type, currency, settlement_frequency",
        });
      }

      // Validate that the site only has one bank account or one mobile money account
      const checkQuery = `
            SELECT COUNT(*) AS bank_count, 
                   SUM(account_type = 'mobile_money') AS mobile_money_count
            FROM settlement_accounts
            WHERE site_id = ? AND id != ? AND status = 'active'
          `;

      const [existingCounts] = await mysql_db.execute(checkQuery, [
        site_id,
        settlementId,
      ]);

      const existingBankAccounts = existingCounts[0].bank_count;
      const existingMobileMoneyAccounts = existingCounts[0].mobile_money_count;

      if (
        (account_type === "bank_account" && existingBankAccounts >= 1) ||
        (account_type === "mobile_money" && existingMobileMoneyAccounts >= 1)
      ) {
        return res.status(400).json({
          status: "FAILED",
          description:
            "Each site can only have one bank account or one mobile money account, or one of each",
        });
      }

      const connection = await mysql_db.getConnection(); // Get a connection from the pool

      try {
        await connection.beginTransaction(); // Start the transaction

        const updateQuery = `
              UPDATE settlement_accounts
              SET
                account_type = ?,
                bank_account_holder_name = ?,
                bank_name = ?,
                branch_code = ?,
                bank_account_number = ?,
                card_holder_name = ?,
                card_number = ?,
                card_expiry_date = ?,
                mobile_money_provider = ?,
                msisdn = ?,
                currency = ?,
                settlement_frequency = ?,
                status = ?,
                primary_account = ?,
                bank_account_swift_code = ?,
                verification_status = ?,
                updated_at = ?
              WHERE id = ? AND site_id = ?
            `;

        const values = [
          account_type,
          bank_account_holder_name || null,
          bank_name || null,
          branch_code || null,
          bank_account_number || null,
          card_holder_name || null,
          card_number || null,
          card_expiry_date || null,
          mobile_money_provider || null,
          msisdn || null,
          currency,
          settlement_frequency,
          status || "inactive", // Default status to 'inactive'
          primary_account || 0,
          bank_account_swift_code || null,
          verification_status || "pending_verification",
          moment().format("YYYY-MM-DD HH:mm:ss"), // updated_at
          settlementId,
          site_id,
        ];

        const [result] = await connection.query(updateQuery, values);

        if (result.affectedRows === 0) {
          return res.status(200).json({
            data: [],
            status: "NO_RES",
            description: `No settlement account found with ID ${settlementId}`,
          });
        }

        await connection.commit(); // Commit the transaction

        return res.status(200).json({
          status: "SUCCESS",
          description: `Settlement account with ID ${settlementId} updated successfully`,
        });
      } catch (error) {
        await connection.rollback(); // Rollback the transaction in case of error
        console.error("Error updating settlement account:", error);

        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to update settlement account",
        });
      } finally {
        connection.release(); // Release the connection back to the pool
      }
    }
  );
};

module.exports = {
  routes,
};
