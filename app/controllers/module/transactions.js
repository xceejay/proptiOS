const mysql_db = require("../../config/db.mysql");
const moment = require("moment");
const jwtMiddleware = require("../../middleware/jwt");
const acl = require("../../middleware/acl");

const PREFIX = "/transactions";

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
  app.post(
    PREFIX + "/:property_id",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const property_id = req.params.property_id;
      const {
        tenant_id,
        pm_user_id,
        amount,
        payment_method,
        transaction_id,
        status,
        notes,
        payment_type,
        currency,
        payer,
        recipient,
      } = req.body;

      if (
        !amount ||
        !payment_method ||
        !status ||
        !payment_type ||
        !currency ||
        !payer ||
        !recipient
      ) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: required fields are missing",
        });
      }

      try {
        const insertQuery = `
        INSERT INTO transactions (tenant_id, pm_user_id, property_id, amount, payment_method, transaction_id, status, notes, payment_type, currency, payer, recipient) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
        await mysql_db.execute(insertQuery, [
          tenant_id,
          pm_user_id,
          property_id,
          amount,
          payment_method,
          transaction_id,
          status,
          notes,
          payment_type,
          currency,
          payer,
          recipient,
        ]);

        return res.status(200).json({
          status: "SUCCESS",
          description: "Successfully added the transaction",
        });
      } catch (error) {
        console.error("Error adding transaction:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to add transaction",
        });
      }
    }
  );

  app.put(
    PREFIX + "/:property_id/:id",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const transaction_id = req.params.id;
      const {
        amount,
        payment_method,
        status,
        notes,
        payment_type,
        currency,
        payer,
        recipient,
      } = req.body;

      if (
        !amount ||
        !payment_method ||
        !status ||
        !payment_type ||
        !currency ||
        !payer ||
        !recipient
      ) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid input: required fields are missing",
        });
      }

      try {
        const updateQuery = `
        UPDATE transactions 
        SET amount = ?, payment_method = ?, status = ?, notes = ?, payment_type = ?, currency = ?, payer = ?, recipient = ?, updated_at = NOW() 
        WHERE id = ?
      `;
        const [result] = await mysql_db.execute(updateQuery, [
          amount,
          payment_method,
          status,
          notes,
          payment_type,
          currency,
          payer,
          recipient,
          transaction_id,
        ]);

        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: "FAILED",
            description: "Transaction not found",
          });
        }

        return res.status(200).json({
          status: "SUCCESS",
          description: "Successfully updated the transaction",
        });
      } catch (error) {
        console.error("Error updating transaction:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to update transaction",
        });
      }
    }
  );

  app.get(
    PREFIX + "/:property_id/:page/:limit",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),

    async (req, res) => {
      const property_id = req.params.property_id;
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const limit = Math.max(parseInt(req.query.limit) || 10, 1);
      const offset = (page - 1) * limit;

      try {
        const totalQuery = `
          SELECT COUNT(*) AS total 
          FROM transactions 
          WHERE property_id = ? AND deleted_at IS NULL
        `;
        const [totalResults] = await mysql_db.execute(totalQuery, [
          property_id,
        ]);
        const totalTransactions = totalResults[0]?.total || 0;
        const totalPages = Math.ceil(totalTransactions / limit);

        const selectQuery = `
          SELECT id, tenant_id, pm_user_id, amount, payment_method, status, notes, payment_type, currency, created_at, updated_at, payer, recipient 
          FROM transactions 
          WHERE property_id = ? AND deleted_at IS NULL
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
            totalTransactions,
            totalPages,
            items: results,
          },
        });
      } catch (error) {
        console.error("Error fetching transactions:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch transactions",
        });
      }
    }
  );

  app.get(
    PREFIX + "/type/:payment_type",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    async (req, res) => {
      const siteId = req.user.site_id;
      const paymentType = req.params.payment_type;
      const startDate = req.query.start_date || null;
      const endDate = req.query.end_date || null;
      const tenantId = req.query.tenant_id;
      const propertyId = req.query.property_id;
      const status = req.query.status;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      try {
        let transactionsQuery = `
          SELECT 
            transactions.id, 
            transactions.rent_payment_type, 
            transactions.tenant_id, 
            transactions.pm_user_id, 
            transactions.property_id, 
            transactions.unit_id,
            transactions.amount, 
            transactions.payment_method,
            transactions.transaction_id, 
            transactions.status, 
            transactions.notes, 
            transactions.payment_type, 
            transactions.currency, 
            transactions.created_at, 
            transactions.uuid, 
            transactions.payer, 
            transactions.recipient,
            transactions.payment_method_address_type, 
            transactions.payment_method_address_value, 
            transactions.payment_provider,
            tenants.name AS tenant_name,
            pm_users.name AS pm_user_name,
            units.name AS unit_name,
            properties.property_name AS property_name
          FROM transactions
          LEFT JOIN tenants ON transactions.tenant_id = tenants.id
          LEFT JOIN pm_users ON transactions.pm_user_id = pm_users.id
          LEFT JOIN units ON transactions.unit_id = units.id
          LEFT JOIN properties ON transactions.property_id = properties.id
          WHERE transactions.payment_type = ?
            AND transactions.site_id = ?
            AND transactions.deleted_at IS NULL
        `;

        const queryParams = [paymentType, siteId];

        if (startDate && endDate) {
          transactionsQuery += " AND transactions.created_at BETWEEN ? AND ?";
          queryParams.push(startDate, endDate);
        }

        if (tenantId) {
          transactionsQuery += " AND transactions.tenant_id = ?";
          queryParams.push(tenantId);
        }

        if (propertyId) {
          transactionsQuery += " AND transactions.property_id = ?";
          queryParams.push(propertyId);
        }

        if (status) {
          transactionsQuery += " AND transactions.status = ?";
          queryParams.push(status);
        }

        let countQuery = `
          SELECT COUNT(*) as totalTransactions
          FROM transactions
          WHERE transactions.payment_type = ?
            AND transactions.site_id = ?
            AND transactions.deleted_at IS NULL
        `;
        const countParams = [paymentType, siteId];

        if (startDate && endDate) {
          countQuery += " AND transactions.created_at BETWEEN ? AND ?";
          countParams.push(startDate, endDate);
        }

        if (tenantId) {
          countQuery += " AND transactions.tenant_id = ?";
          countParams.push(tenantId);
        }

        if (propertyId) {
          countQuery += " AND transactions.property_id = ?";
          countParams.push(propertyId);
        }

        if (status) {
          countQuery += " AND transactions.status = ?";
          countParams.push(status);
        }

        const [countResult] = await mysql_db.execute(countQuery, countParams);
        const totalTransactions = countResult[0].totalTransactions;

        transactionsQuery += " ORDER BY transactions.created_at DESC LIMIT ? OFFSET ?";
        queryParams.push(limit, offset);

        const [transactions] = await mysql_db.execute(
          transactionsQuery,
          queryParams
        );

        return res.status(200).json({
          status: "SUCCESS",
          data: {
            transactions: transactions,
            pagination: {
              page: page,
              limit: limit,
              totalTransactions: totalTransactions,
              totalPages: Math.ceil(totalTransactions / limit),
            },
          },
        });
      } catch (error) {
        console.error("Error fetching transactions:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch transactions",
        });
      }
    }
  );
  

  //financial reports

  app.get(
    PREFIX + "/reports",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    async (req, res) => {
      const siteId = req.user.site_id;
      const startDate = req.query.start_date || "1970-01-01"; // Default to a very early date
      const endDate = req.query.end_date || "9999-12-31"; // Default to a future date
      const page = req.query.page ? parseInt(req.query.page) : null;
      const limit = req.query.limit ? parseInt(req.query.limit) : null;
      const offset = page && limit ? (page - 1) * limit : null;

      try {
        // Step 1: Fetch transactions with or without pagination
        let query = `SELECT id, uuid, amount, currency, payment_type,payment_method, property_id, created_at 
                     FROM transactions 
                     WHERE status = 'completed' 
                       AND site_id = ? 
                       AND created_at BETWEEN ? AND ? AND deleted_at  IS NULL`;

        // Add pagination only if both page and limit are specified
        if (page && limit) {
          query += ` LIMIT ? OFFSET ?`;
        }

        const queryParams = [siteId, startDate, endDate];
        if (page && limit) {
          queryParams.push(limit, offset);
        }

        const [allTransactions] = await mysql_db.execute(query, queryParams);

        // Fetch properties (no need for pagination here)
        const [properties] = await mysql_db.execute(
          `SELECT id, property_name 
           FROM properties 
           WHERE site_id = ? AND deleted_at IS NULL`,
          [siteId]
        );

        const propertyIncome = {};
        const propertyExpenses = {};
        let totalRevenue = 0;
        let totalExpenses = 0;
        let netOperatingIncome = 0;

        let revenueTransactions = [];
        let expenseTransactions = [];
        let operatingRevenueTransactions = [];
        let operatingExpenseTransactions = [];

        // Step 2: Process Transactions and Calculate Metrics
        for (const transaction of allTransactions) {
          const transactionAmount = parseFloat(transaction.amount);
          const paymentType = transaction.payment_type;
          const propertyId = transaction.property_id;

          const transactionData = {
            id: transaction.id,
            uuid: transaction.uuid,
            amount: transactionAmount.toFixed(2),
            currency: transaction.currency,
            payment_method: transaction.payment_method,
            created_at: transaction.created_at,
            payment_type: paymentType,
          };

          if (["rent", "management_fee"].includes(paymentType)) {
            totalRevenue += transactionAmount;
            propertyIncome[propertyId] =
              (propertyIncome[propertyId] || 0) + transactionAmount;
            revenueTransactions.push(transactionData);

            // Operating revenue includes rent and management fees
            operatingRevenueTransactions.push(transactionData);
          } else {
            totalExpenses += transactionAmount;
            propertyExpenses[propertyId] =
              (propertyExpenses[propertyId] || 0) + transactionAmount;
            expenseTransactions.push(transactionData);

            // Operating expenses include other costs
            operatingExpenseTransactions.push(transactionData);
          }
        }

        netOperatingIncome = totalRevenue - totalExpenses;

        // Step 3: Construct the Financial Reports Structure
        const financialReports = {
          Income: [
            {
              title: "Net Income (Profit & Loss)",
              description:
                "Revenue minus expenses, highlighting profitability.",
              breakdown: {
                revenues: {
                  title: "Total Revenues",
                  transactions: revenueTransactions,
                  amount: totalRevenue.toFixed(2),
                },
                expenses: {
                  title: "Total Expenses",
                  transactions: expenseTransactions,
                  amount: totalExpenses.toFixed(2),
                },
                net_income: {
                  title: "Net Income",
                  amount: (totalRevenue - totalExpenses).toFixed(2),
                },
              },
            },
            {
              title: "Net Income By Property",
              description: "Summary of your profitability for each property.",
              breakdown: properties.map((property) => ({
                property_name: property.property_name,
                net_income: {
                  revenues: (propertyIncome[property.id] || 0).toFixed(2),
                  expenses: (propertyExpenses[property.id] || 0).toFixed(2),
                  net_income: (
                    (propertyIncome[property.id] || 0) -
                    (propertyExpenses[property.id] || 0)
                  ).toFixed(2),
                },
              })),
            },
            {
              title: "Owner Statement",
              description:
                "Summarizes your rental property's income, expenses, and net profit.",
              breakdown: {
                revenues: revenueTransactions,
                expenses: expenseTransactions,
                total_revenue: totalRevenue.toFixed(2),
                total_expenses: totalExpenses.toFixed(2),
                net_income: (totalRevenue - totalExpenses).toFixed(2),
              },
            },
            {
              title: "Rent Roll",
              description:
                "Lists all tenants, rental units, and lease details, providing a snapshot of rental income and occupancy status.",
              breakdown: {
                transactions: [], // Placeholder for tenant and lease data
              },
            },
          ],
          "Cash Flow": [
            {
              title: "Operating Cash Flow",
              description: "Tracks cash generated or used in daily operations.",
              breakdown: {
                revenues: {
                  title: "Operating Revenues",
                  transactions: operatingRevenueTransactions,
                  amount: totalRevenue.toFixed(2),
                },
                expenses: {
                  title: "Operating Expenses",
                  transactions: operatingExpenseTransactions,
                  amount: totalExpenses.toFixed(2),
                },
                net_operating_income: {
                  title: "Net Operating Income",
                  amount: netOperatingIncome.toFixed(2),
                },
              },
            },
            {
              title: "Operating Cash Flow By Property",
              description: "The cash generated or used for each property.",
              breakdown: properties.map((property) => ({
                property_name: property.property_name,
                operating_cash_flow: {
                  revenues: (propertyIncome[property.id] || 0).toFixed(2),
                  expenses: (propertyExpenses[property.id] || 0).toFixed(2),
                  net_operating_income: (
                    (propertyIncome[property.id] || 0) -
                    (propertyExpenses[property.id] || 0)
                  ).toFixed(2),
                },
              })),
            },
            {
              title: "Cash Flow Statement",
              description: "Shows all incoming and outgoing cash.",
              breakdown: {
                transactions: allTransactions,
                total_cash_flow: (totalRevenue - totalExpenses).toFixed(2),
              },
            },
            {
              title: "Cash Flows By Property",
              description:
                "Shows all incoming and outgoing cash for each property.",
              breakdown: properties.map((property) => ({
                property_name: property.property_name,
                cash_flow: {
                  total: (
                    (propertyIncome[property.id] || 0) -
                    (propertyExpenses[property.id] || 0)
                  ).toFixed(2),
                },
              })),
            },
          ],
          Performance: [
            {
              title: "Net Operating Income (NOI)",
              description:
                "Helps show profitability before financing and taxes.",
              breakdown: {
                operating_revenues: {
                  title: "Total Operating Revenues",
                  transactions: operatingRevenueTransactions,
                  amount: totalRevenue.toFixed(2),
                },
                operating_expenses: {
                  title: "Total Operating Expenses",
                  transactions: operatingExpenseTransactions,
                  amount: totalExpenses.toFixed(2),
                },
                net_operating_income: {
                  title: "Net Operating Income",
                  amount: netOperatingIncome.toFixed(2),
                },
              },
            },
            {
              title: "Cash on Cash",
              description:
                "Compares the cash earned from your rental property to the cash invested.",
              breakdown: {
                // Placeholder for when investment data is available
                transactions: [],
                amount: "0.00",
              },
            },
            {
              title: "Cap Rate",
              description:
                "Calculates the rate of return on your rental property by comparing its net operating income to its market value.",
              breakdown: {
                // Placeholder for when market value data is available
                transactions: [],
                amount: "0.00",
              },
            },
            {
              title: "Operating Expense Ratio",
              description:
                "Shows the percentage of your rental income spent on operating expenses.",
              ratio: (totalExpenses / totalRevenue).toFixed(2),
            },
          ],
          Assets: [
            {
              title: "Portfolio Value By Property",
              description:
                "Tracks the value of each property within a portfolio.",
              breakdown: {
                properties: [], // Placeholder for property value data
                total_value: "0.00",
              },
            },
            {
              title: "Balance Sheet",
              description:
                "Snapshot of assets, liabilities, and equity at a specific point in time.",
              breakdown: {
                // Placeholder for balance sheet data
                assets: [],
                liabilities: [],
                equity: [],
                total_assets: "0.00",
                total_liabilities: "0.00",
                equity_value: "0.00",
              },
            },
          ],
          Taxes: [
            {
              title: "Tax Packet Export",
              description:
                "A comprehensive export of tax-related documents and data.",
              breakdown: {
                transactions: [], // Placeholder for tax packet
              },
            },
            {
              title: "Tax Review",
              description:
                "Reviews tax-related information for accuracy and compliance.",
              breakdown: {
                transactions: [], // Placeholder for tax review data
              },
            },
            {
              title: "Schedule E",
              description:
                "Details income and expenses for rental properties and real estate investments.",
              breakdown: {
                transactions: [], // Placeholder for Schedule E data
              },
            },
            {
              title: "Form 8825",
              description:
                "Reports income and expenses for rental real estate activities required by Form 8825.",
              breakdown: {
                transactions: [], // Placeholder for Form 8825 data
              },
            },
          ],
        };

        // Step 4: Return the Financial Reports
        return res.status(200).json({
          status: "SUCCESS",
          data: financialReports,
        });
      } catch (error) {
        console.error("Error generating financial reports:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to generate financial reports",
        });
      }
    }
  );

  app.get(
    PREFIX,
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
        SELECT id, uuid , amount, status, currency, payment_type, payment_method, created_at, deleted_at
        FROM transactions 
        WHERE site_id = ? 
          AND status = 'completed'
          AND created_at BETWEEN ? AND ?
          AND deleted_at IS NULL`;
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

        // Step 3: Calculate total revenue and expenses based on all transactions
        for (const transaction of allTransactions) {
          const transactionId = transaction.id;
          const transactionUUID = transaction.uuid;
          const transactionStatus = transaction.status;
          const transactionPaymentMethod = transaction.payment_method;

          const transactionAmount = parseFloat(transaction.amount);
          const transactionCurrency = transaction.currency.toLowerCase();
          const paymentType = transaction.payment_type;

          // Fetch the exchange rate for each transaction's currency to the site's currency
          const currencyAPIUrl = `https://latest.currency-api.pages.dev/v1/currencies/${transactionCurrency}.json`;
          const currencyResponse = await axios.get(currencyAPIUrl);
          const exchangeRates = currencyResponse.data;

          // Get the conversion rate for the transaction's currency
          const conversionRate =
            exchangeRates[transactionCurrency]?.[siteCurrency.toLowerCase()] ||
            1;

          // Convert the transaction amount to the site's currency
          const convertedAmount = transactionAmount * conversionRate;

          // Categorize the transaction as revenue or expense and store them in arrays
          categorizedTransactions[paymentType].push({
            id: transactionId,
            uuid: transactionUUID,
            status: transactionStatus,
            payment_method: transactionPaymentMethod,
            amount: convertedAmount.toFixed(2),
            currency: siteCurrency,
            payment_type: paymentType,
            created_at: transaction.created_at,
          });

          if (paymentType === "rent" || paymentType === "management_fee") {
            totalRevenue += convertedAmount;
            revenueTransactions.push({
              id: transactionId,
              uuid: transactionUUID,
              status: transactionStatus,
              payment_method: transactionPaymentMethod,
              amount: convertedAmount.toFixed(2),
              currency: siteCurrency,
              payment_type: paymentType,
              created_at: transaction.created_at,
            });
          } else {
            totalExpenses += convertedAmount;
            expenseTransactions.push({
              id: transactionId,
              uuid: transactionUUID,
              status: transactionStatus,
              payment_method: transactionPaymentMethod,
              amount: convertedAmount.toFixed(2),
              currency: siteCurrency,
              payment_type: paymentType,
              created_at: transaction.created_at,
            });
          }
        }

        // Calculate income (Revenue - Expenses)
        const totalIncome = totalRevenue - totalExpenses;

        // Step 4: Fetch paginated "completed" transactions for the response based on the created_at date
        let paginatedTransactionsQuery = `
        SELECT id, uuid , amount, currency,  payment_type, status,  payment_method, transaction_id, created_at 
        FROM transactions 
        WHERE site_id = ? 
          AND status = 'completed'
          AND created_at BETWEEN ? AND ?
          AND deleted_at IS NULL
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?`;
        const [paginatedTransactions] = await mysql_db.execute(
          paginatedTransactionsQuery,
          [siteId, startDate, endDate, limit, offset]
        );

        // Step 5: Return the accounting data along with paginated transactions for income, expenses, revenue, and categorized payment types
        return res.status(200).json({
          status: "SUCCESS",
          data: {
            revenue: totalRevenue.toFixed(2),
            expenses: totalExpenses.toFixed(2),
            income: totalIncome.toFixed(2),
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
        console.error("Error calculating accounting data:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to calculate accounting data",
        });
      }
    }
  );

  //get all transactions
  app.get(
    PREFIX,
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
        // Count the total number of transactions for either pagination or to get all transactions
        const countQuery = `
          SELECT COUNT(DISTINCT transactions.id) AS totalTransactions
          FROM transactions
          WHERE transactions.site_id = ? AND transactions.deleted_at IS NULL
        `;
        const [countResult] = await mysql_db.execute(countQuery, [
          req.user.site_id,
        ]);
        const totalTransactions = countResult[0].totalTransactions;

        let selectQuery;
        let queryParams;

        if (paginationEnabled) {
          const offset = (page - 1) * limit;
          selectQuery = `
            SELECT 
              transactions.id AS transaction_id,
              transactions.uuid,
              transactions.tenant_id AS transaction_tenant_id,
              transactions.property_id AS transaction_property_id,
              transactions.unit_id AS transaction_unit_id,
              transactions.pm_user_id AS transaction_pm_user_id,
              transactions.amount,
              transactions.currency,
              transactions.transaction_type,
              transactions.payment_method,
              transactions.status,
              transactions.transaction_date,
              transactions.created_at,
              transactions.updated_at,
  
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
  
              pm_users.name AS pm_user_name,
              pm_users.email AS pm_user_email
            FROM transactions
            LEFT JOIN tenants ON transactions.tenant_id = tenants.id
            LEFT JOIN properties ON transactions.property_id = properties.id
            LEFT JOIN units ON transactions.unit_id = units.id
            LEFT JOIN pm_users ON transactions.pm_user_id = pm_users.id
            WHERE transactions.site_id = ? AND transactions.deleted_at IS NULL
            LIMIT ? OFFSET ?
          `;
          queryParams = [req.user.site_id, limit, offset];
        } else {
          // If pagination is not enabled, return all transactions without LIMIT and OFFSET
          selectQuery = `
            SELECT 
              transactions.id AS id,
              transactions.transaction_id AS transaction_id,
              transactions.uuid,
              transactions.tenant_id AS transaction_tenant_id,
              transactions.property_id AS transaction_property_id,
              transactions.unit_id AS transaction_unit_id,
              transactions.pm_user_id AS transaction_pm_user_id,
              transactions.amount,
              transactions.currency,
              transactions.transaction_type,
              transactions.payment_method,
              transactions.status,
              transactions.transaction_date,
              transactions.created_at,
              transactions.updated_at,
  
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
  
              pm_users.name AS pm_user_name,
              pm_users.email AS pm_user_email
            FROM transactions
            LEFT JOIN tenants ON transactions.tenant_id = tenants.id
            LEFT JOIN properties ON transactions.property_id = properties.id
            LEFT JOIN units ON transactions.unit_id = units.id
            LEFT JOIN pm_users ON transactions.pm_user_id = pm_users.id
            WHERE transactions.site_id = ? AND transactions.deleted_at IS NULL
          `;
          queryParams = [req.user.site_id];
        }

        const [results] = await mysql_db.execute(selectQuery, queryParams);

        if (results.length === 0) {
          return res.status(404).json({
            status: "FAILED",
            description: "No transactions found",
          });
        }

        const transactions = {};

        results.forEach((row) => {
          if (!transactions[row.id]) {
            transactions[row.id] = {
              id: row.id,
              transaction_id: row.transaction_id,
              uuid: row.uuid,
              tenant_id: row.transaction_tenant_id,
              property_id: row.transaction_property_id,
              unit_id: row.transaction_unit_id,
              pm_user_id: row.transaction_pm_user_id,
              amount: row.amount,
              currency: row.currency,
              transaction_type: row.transaction_type,
              payment_method: row.payment_method,
              status: row.status,
              transaction_date: row.transaction_date,
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
              pm_user: {
                name: row.pm_user_name,
                email: row.pm_user_email,
              },
            };
          }
        });

        // Convert transactions object to array
        const transactionArray = Object.values(transactions);

        const response = {
          status: "SUCCESS",
          data: {
            totalTransactions,
            items: transactionArray,
          },
        };

        if (paginationEnabled) {
          const totalPages = Math.ceil(totalTransactions / limit);
          response.data.page = page;
          response.data.limit = limit;
          response.data.totalPages = totalPages;
        }

        return res.status(200).json(response);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch transactions",
        });
      }
    }
  );

  app.get(
    PREFIX + "/:transaction_id",
    jwtMiddleware,
    acl(["property_owner", "property_manager", "property_coordinator"]),
    async (req, res) => {
      const { transaction_id } = req.params;

      try {
        const selectQuery = `
          SELECT 
            transactions.id,
            transactions.uuid,
            transactions.rent_payment_type,
            transactions.tenant_id,
            transactions.pm_user_id,
            transactions.property_id,
            transactions.unit_id,
            transactions.amount,
            transactions.payment_method,
            transactions.transaction_id,
            transactions.status,
            transactions.notes,
            transactions.payment_type,
            transactions.currency,
            transactions.created_at,
            transactions.updated_at,
            transactions.deleted_at,
            transactions.payer,
            transactions.recipient,
            transactions.site_id,
            transactions.payment_method_address_type,
            transactions.payment_method_address_value,
            transactions.payment_provider,
  
            tenants.name AS tenant_name,
            tenants.email AS tenant_email,
            tenants.tel_number AS tenant_tel_number,
  
            properties.property_name AS property_name,
            properties.property_address AS property_address,
            properties.property_type AS property_type,

            units.name AS unit_name

          FROM transactions
          LEFT JOIN tenants ON transactions.tenant_id = tenants.id
          LEFT JOIN properties ON transactions.property_id = properties.id
          LEFT JOIN units ON transactions.unit_id = units.id

          WHERE transactions.uuid = ? 
          AND transactions.site_id = ? 
          AND transactions.deleted_at IS NULL
        `;

        const [results] = await mysql_db.execute(selectQuery, [
          transaction_id,
          req.user.site_id,
        ]);

        if (results.length === 0) {
          return res.status(404).json({
            status: "FAILED",
            description: "Transaction not found",
          });
        }

        const row = results[0];

        const transactionInfo = {
          id: row.id,
          uuid: row.uuid,
          rent_payment_type: row.rent_payment_type,
          tenant_id: row.tenant_id,
          property_id: row.property_id,
          pm_user_id: row.pm_user_id,
          amount: row.amount,
          payment_method: row.payment_method,
          transaction_id: row.transaction_id,
          status: row.status,
          notes: row.notes,
          payment_type: row.payment_type,
          currency: row.currency,
          created_at: row.created_at,
          updated_at: row.updated_at,
          payer: row.payer,
          recipient: row.recipient,
          payment_method_address_type: row.payment_method_address_type,
          payment_method_address_value: row.payment_method_address_value,
          payment_provider: row.payment_provider,
        };

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
        };

        return res.status(200).json({
          status: "SUCCESS",
          data: {
            ...transactionInfo,
            tenant: tenantInfo,
            property: propertyInfo,
            unit: unitInfo,
          },
        });
      } catch (error) {
        console.error("Error fetching transaction:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch transaction",
        });
      }
    }
  );
};

module.exports = {
  routes,
};

