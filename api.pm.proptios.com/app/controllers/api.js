const jodlet = require("./module/unused/jodlet"); // greeter routes
const deployment = require("./module/unused/deployment"); // greeter routes
const test_module = require("./module/unused/test"); // crud routes
const scripts = require("./module/unused/scripts"); // scripts routes
const client = require("./module/unused/client"); // client routes
const telegram = require("./module/unused/telegram"); // test-email routes
const crud = require("./module/demos/crud"); // crud routes
const test_email = require("./module/demos/test-email"); // test-email routes
const sample = require("./module/demos/sample"); // sample routes

const uniqid = require("uniqid"); // an id
var geoip = require("geoip-lite");

const auth = require("./module/auth"); // auth routes
const properties = require("./module/properties"); // properties routes
const transactions = require("./module/transactions"); // transactions routes
const tenants = require("./module/tenants"); // tenants routes
const pm_users = require("./module/users"); // tenants routes
const leases = require("./module/leases"); // tenants routes
const audit = require("./module/audit"); // audit routes
const settlements = require("./module/settlements"); // tenants routes
const uploads = require("./module/uploads"); // storage routes

const site = require("./module/site"); // tenants routes

const run = (app) => {
  // Default Public Route
  app.get("/", function (req, res) {
    var getClientAddress =
      (req.headers["x-forwarded-for"] || "").split(",")[0] ||
      req.connection.remoteAddress;
    var geo = geoip.lookup(getClientAddress);
    res.json({
      api_version: "1.0.0",
      heartbeat: "/ping",
      "tracking-code": uniqid(),
      "ip-addr": getClientAddress,
      "secure-scan": geo,
    });
  });

  // Heartbeat endpoint for polling
  app.get("/ping", function (req, res) {
    res.setHeader("Content-Type", "text/plain");
    res.end("pong");
  });

  // ==================================
  // All Logical Route Groups Down Here
  // ==================================
  // sample.routes(app); // Est.
  // greeter.routes(app); // Est.
  // client.routes(app); // Est.
  // app.use('/tenants', tenants);// Est.
  // jodlet.routes(app); // Est.
  // deployment.routes(app); // Est.
  // telegram.routes(app);
  // scripts.routes(app);
  // test_module.routes(app);
  // pm.routes(app)

  //Main routes
  auth.routes(app); // authentication route
  properties.routes(app); // singular because each property belongs to a domain, so it is like an independant web app.
  transactions.routes(app); //transaction actions
  tenants.routes(app);
  leases.routes(app);
  settlements.routes(app);
  pm_users.routes(app);
  audit.routes(app)
  site.routes(app);
  uploads.routes(app);

  // Demo and Test Routes
  crud.routes(app);
  test_email.routes(app);
};

module.exports = {
  run,
};
