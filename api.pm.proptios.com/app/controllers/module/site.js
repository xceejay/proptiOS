const mysql_db = require("../../config/db.mysql");
const moment = require("moment");
const axios = require("axios"); // Used for currency conversion API calls
const jwtMiddleware = require("../../middleware/jwt");
const acl = require("../../middleware/acl");

const PREFIX = "/site";

// In-memory currency rate cache — keyed by currency code, expires after 1 hour.
// Prevents N+1 HTTP calls to currency-api for every transaction on the dashboard.
const currencyCache = new Map();
const CURRENCY_CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function getExchangeRates(currencyCode) {
  const now = Date.now();
  const cached = currencyCache.get(currencyCode);
  if (cached && now - cached.ts < CURRENCY_CACHE_TTL) {
    return cached.data;
  }
  const url = `https://latest.currency-api.pages.dev/v1/currencies/${currencyCode}.json`;
  const response = await axios.get(url, { timeout: 10000 });
  currencyCache.set(currencyCode, { data: response.data, ts: now });
  return response.data;
}

const routes = (app) => {
  app.get(
    "/properties",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    async (req, res) => {
      const site_id = req.user.site_id;
      try {
        let query = "SELECT * FROM properties WHERE site_id = ?";

        const [results] = await mysql_db.execute(query, [site_id]);

        return res.status(200).json({
          status: "SUCCESS",
          data: results,
        });
      } catch (error) {
        console.error("Error fetching sites:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch properties",
        });
      }
    }
  );

  app.get(
    PREFIX + "/sites/:id?",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    async (req, res) => {
      const siteId = req.params.id;
      try {
        let query = "SELECT * FROM sites";
        let params = [];

        if (siteId) {
          query += " WHERE id = ?";
          params.push(siteId);
        }

        const [results] = await mysql_db.execute(query, params);

        return res.status(200).json({
          status: "SUCCESS",
          data: results,
        });
      } catch (error) {
        console.error("Error fetching sites:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch sites",
        });
      }
    }
  );

  app.get(
    "/dashboard",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    async (req, res) => {
      const siteId = req.user.site_id; // Get site_id from the authenticated user's data
      const startDate = req.query.start_date || "1970-01-01"; // Default to a very early date
      const endDate = req.query.end_date || "9999-12-31"; // Default to a future date
      const page = parseInt(req.query.page) || 1; // Get page number from query, default is 1
      const limit = parseInt(req.query.limit) || 10; // Get limit from query, default is 10
      const offset = (page - 1) * limit; // Calculate the offset for pagination

      try {
        // Step 1: Fetch the site's currency from the sites table
        let siteQuery = "SELECT currency FROM sites WHERE id = ?";
        const [siteResults] = await mysql_db.execute(siteQuery, [siteId]);
        const siteCurrency = siteResults[0]?.currency || "USD"; // Default to USD if no currency is set

        // Step 2: Fetch all "completed" transactions within the date range for revenue and expenses calculation
        let allTransactionsQuery = `
        SELECT id, uuid , amount, status, currency, payment_type, payment_method, created_at
        FROM transactions 
        WHERE status = 'completed' 
          AND site_id = ? 
          AND created_at BETWEEN ? AND ?`;
        const [allTransactions] = await mysql_db.execute(allTransactionsQuery, [
          siteId,
          startDate,
          endDate,
        ]);

        let totalRevenue = 0;
        let totalExpenses = 0;
        let incomeTransactions = [];
        let expenseTransactions = [];
        let revenueTransactions = [];
        let categorizedTransactions = {
          rent: [],
          management_fee: [],
          maintenance_and_repairs: [],
          tenant_management: [],
          administrative_cost: [],
          marketing_and_advertising: [],
          legal_and_accounting: [],
          insurance: [],
          miscellaneous: [],
        };

        // Step 3: Pre-fetch exchange rates for all unique currencies (instead of per-transaction)
        const uniqueCurrencies = [
          ...new Set(allTransactions.map((t) => t.currency.toLowerCase())),
        ];
        const ratesByCurrency = {};
        await Promise.all(
          uniqueCurrencies.map(async (cur) => {
            try {
              ratesByCurrency[cur] = await getExchangeRates(cur);
            } catch (err) {
              console.error(`Failed to fetch rates for ${cur}:`, err.message);
              ratesByCurrency[cur] = null;
            }
          })
        );

        // Step 4: Calculate totals and categorize using cached rates
        for (const transaction of allTransactions) {
          const transactionId = transaction.id;
          const transactionUUID = transaction.uuid;
          const transactionStatus = transaction.status;
          const transactionPaymentMethod = transaction.payment_method;

          const transactionAmount = parseFloat(transaction.amount);
          const transactionCurrency = transaction.currency.toLowerCase();
          const paymentType = transaction.payment_type;

          const exchangeRates = ratesByCurrency[transactionCurrency];
          const conversionRate =
            exchangeRates?.[transactionCurrency]?.[siteCurrency.toLowerCase()] ||
            1;

          const convertedAmount = transactionAmount * conversionRate;

          const txRecord = {
            id: transactionId,
            uuid: transactionUUID,
            status: transactionStatus,
            payment_method: transactionPaymentMethod,
            amount: convertedAmount.toFixed(2),
            currency: siteCurrency,
            payment_type: paymentType,
            created_at: transaction.created_at,
          };

          // Categorize the transaction as revenue or expense
          if (categorizedTransactions[paymentType]) {
            categorizedTransactions[paymentType].push(txRecord);
          }

          if (paymentType === "rent" || paymentType === "management_fee") {
            totalRevenue += convertedAmount;
            revenueTransactions.push(txRecord);
          } else {
            totalExpenses += convertedAmount;
            expenseTransactions.push(txRecord);
          }
        }

        // Calculate income (Revenue - Expenses)
        const totalIncome = totalRevenue - totalExpenses;

        // Step 4: Fetch paginated "completed" transactions for the response based on the created_at date
        let paginatedTransactionsQuery = `
        SELECT id, uuid ,amount, currency,  payment_type, status,  payment_method, transaction_id, created_at 
        FROM transactions 
        WHERE site_id = ? 
          AND status = 'completed'
          AND created_at BETWEEN ? AND ? AND deleted_at is null
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?`;
        const [paginatedTransactions] = await mysql_db.execute(
          paginatedTransactionsQuery,
          [siteId, startDate, endDate, limit, offset]
        );

        // Step 5: Fetch the site's properties, units, tenants, and leases
        let sitePropertiesQuery =
          "SELECT COUNT(*) as total_properties FROM properties WHERE site_id = ? and deleted_at is null"; ;
        const [siteProperties] = await mysql_db.execute(sitePropertiesQuery, [
          siteId,
        ]);

        let siteUnitsQuery =
          "SELECT COUNT(*) as total_units FROM units WHERE site_id = ? and deleted_at is null";
        const [siteUnits] = await mysql_db.execute(siteUnitsQuery, [siteId]);

        let siteTenantsQuery =
          "SELECT COUNT(*) as total_tenants FROM tenants WHERE site_id = ? and deleted_at is null";
        const [siteTenants] = await mysql_db.execute(siteTenantsQuery, [
          siteId,
        ]);

        let siteLeasesQuery =
          `SELECT COUNT(*) as total_leases FROM leases WHERE site_id = ? and (end_date < ?  or status = 'active')and deleted_at is null`;

          today = new Date();
        const [siteLeases] = await mysql_db.execute(siteLeasesQuery, [siteId, today]);

        // Step 6: Return the accounting data along with paginated transactions and the site's properties, units, tenants, and leases
        return res.status(200).json({
          status: "SUCCESS",
          data: {
            revenue: totalRevenue.toFixed(2),
            expenses: totalExpenses.toFixed(2),
            income: totalIncome.toFixed(2),
            total_properties: siteProperties[0]?.total_properties || 0,
            total_units: siteUnits[0]?.total_units || 0,
            total_tenants: siteTenants[0]?.total_tenants || 0,
            total_leases: siteLeases[0]?.total_leases || 0,
            currency: siteCurrency,
            transactions: {
              expenses: expenseTransactions.slice(offset, offset + limit),
              revenue: revenueTransactions.slice(offset, offset + limit),
            },
            transaction_categories: categorizedTransactions, // Returns transactions grouped by payment_type
            pagination: {
              page: page,
              limit: limit,
              totalTransactions: allTransactions.length,
            },
          },
        });
      } catch (error) {
        console.error("Failed to return Dashboard Data", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to return Dashboard Data",
        });
      }
    }
  );

  app.get(
    PREFIX + "/sites/:id?",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    async (req, res) => {
      const siteId = req.params.id;
      try {
        let query = "SELECT * FROM sites";
        let params = [];

        if (siteId) {
          query += " WHERE id = ?";
          params.push(siteId);
        }

        const [results] = await mysql_db.execute(query, params);

        return res.status(200).json({
          status: "SUCCESS",
          data: results,
        });
      } catch (error) {
        console.error("Error fetching sites:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch sites",
        });
      }
    }
  );

  app.post(
    PREFIX + "/sites",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    async (req, res) => {
      const {
        site_id,
        uuid,
        site_subdomain,
        site_description,
        pm_user_id,
        subscription,
        status,
        site_image_url,
      } = req.body;

      const insertSiteQuery = `
      INSERT INTO sites (id, uuid, site_subdomain, site_description, pm_user_id, subscription, status, site_image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

      try {
        await mysql_db.execute(insertSiteQuery, [
          site_id,
          uuid,
          site_subdomain,
          site_description,
          pm_user_id,
          subscription,
          status,
          site_image_url,
        ]);

        return res.status(200).json({
          status: "SUCCESS",
          description: "Successfully created site",
        });
      } catch (error) {
        console.error("Error creating site:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to create site",
        });
      }
    }
  );
  app.put(
    PREFIX + "/sites/:id",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    async (req, res) => {
      const siteId = req.params.id;
      const {
        site_id,
        uuid,
        site_subdomain,
        site_description,
        pm_user_id,
        subscription,
        status,
        site_image_url,
      } = req.body;

      const updateSiteQuery = `
      UPDATE sites
      SET site_id = ?, uuid = ?, site_subdomain = ?, site_description = ?, pm_user_id = ?, subscription = ?, status = ?, site_image_url = ?
      WHERE id = ?
    `;

      try {
        const [results] = await mysql_db.execute(updateSiteQuery, [
          site_id,
          uuid,
          site_subdomain,
          site_description,
          pm_user_id,
          subscription,
          status,
          site_image_url,
          siteId,
        ]);

        if (results.affectedRows === 0) {
          return res.status(404).json({
            status: "FAILED",
            description: "Site not found",
          });
        }

        return res.status(200).json({
          status: "SUCCESS",
          description: "Successfully updated site",
        });
      } catch (error) {
        console.error("Error updating site:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to update site",
        });
      }
    }
  );
};

module.exports = {
  routes,
};
