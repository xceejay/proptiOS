const mysql_db = require("../config/db.mysql");

// Grace period in days
const gracePeriodDays = 7;

const subscriptionAccess = (requiredTier) => {
  return async (req, res, next) => {
    if (!req.user || !req.user.site_id) {
      console.error("Missing user information in request");
      if (!res.headersSent) {
        return res.status(401).json({
          status: "FAILED",
          description: "Unauthorized Access: Missing user information",
        });
      }
      return;
    }

    const query = `
      SELECT sh.subscription_id, sh.start_date, sh.end_date, s.name AS subscription_tier
      FROM subscription_history AS sh
      JOIN subscriptions AS s ON sh.subscription_id = s.id
      WHERE sh.site_id = ? AND sh.status = "active"
      ORDER BY sh.start_date DESC
      LIMIT 1
    `;

    try {
      const [results] = await mysql_db.execute(query, [req.user.site_id]);

      if (results.length > 0) {
        const { subscription_tier, end_date } = results[0];

        // Check if the subscription has expired
        if (end_date && new Date() > new Date(end_date)) {
          const expiredDate = new Date(end_date);
          const graceEndDate = new Date(expiredDate.setDate(expiredDate.getDate() + gracePeriodDays));

          // Check if the current date is beyond the grace period
          if (new Date() > graceEndDate) {
            return res.status(402).json({
              status: "FAILED",
              description: "Your subscription and grace period have expired. Please renew to continue.",
            });
          } else {
            return res.status(200).json({
              status: "SUCCESS",
              description: `Your subscription has expired, but you are still within the ${gracePeriodDays}-day grace period.`,
            });
          }
        }

        // Subscription levels ordered by access hierarchy
        const tierOrder = ["standard", "premium", "enterprise"];

        // Check if the user's subscription meets the required tier
        if (tierOrder.indexOf(subscription_tier) >= tierOrder.indexOf(requiredTier)) {
          return next();
        } else {
          console.log(`Access denied. Subscription: ${subscription_tier}, Required: ${requiredTier}`);
          if (!res.headersSent) {
            return res.status(402).json({
              status: "FAILED",
              description: `Access Denied: ${requiredTier} subscription required.`,
            });
          }
          return;
        }
      } else {
        console.log("No active subscription found for the site");
        if (!res.headersSent) {
          return res.status(402).json({
            status: "FAILED",
            description: "Unauthorized Access: No valid subscription.",
          });
        }
        return;
      }
    } catch (error) {
      console.error("Database error:", error);
      if (!res.headersSent) {
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Unable to verify subscription.",
        });
      }
      return;
    }
  };
};

module.exports = subscriptionAccess;




// usage


// app.get("/properties", jwtMiddleware,
//  subscriptionAccess("premium"), async (req, res) => {
//     res.json({
//       status: "SUCCESS",
//       description: "You have access to this Premium feature.",
//     });
//   });

