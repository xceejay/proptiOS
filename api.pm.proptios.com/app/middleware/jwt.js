const jwt = require("jsonwebtoken");
const accessTokenSecret = "1234";
const { getRequestedSiteHost, siteMatchesRequest } = require("../services/site_access");

const jwtMiddleware = (req, res, next) => {
  function tokenExpired(token) {
    const payloadBase64 = token.split(".")[1];
    const decodedJson = Buffer.from(payloadBase64, "base64").toString();
    const decoded = JSON.parse(decodedJson);
    const exp = decoded.exp;
    const expired = Date.now() >= exp * 1000;
    return expired;
  }

  let tokenToVerify;

  if (req.header("Authorization")) {
    const parts = req.header("Authorization").split(" ");

    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Bearer$/.test(scheme)) {
        tokenToVerify = credentials;
      } else {
        console.log("Format for Authorization: Bearer [token]");

        return res.status(401).json({
          status: "FAILED",
          description: "Unable to verify Credentials",
        });
      }
    } else {
      console.log("Format for Authorization: Bearer [token]");

      return res.status(401).json({
        status: "FAILED",
        description: "Unable to verify Credentials",
      });
    }
  } else if (req.body.token) {
    tokenToVerify = req.body.token;
    delete req.query.token;
  } else {
    return res.status(401).json({
      status: "FAILED",
      description: "No Authorization [token] found",
    });
  }

  jwt.verify(tokenToVerify, accessTokenSecret, (err, user) => {
    if (tokenExpired(tokenToVerify)) {
      return res
        .status(403)
        .json({ status: "FAILED", description: "Session Expired" });
    }

    if (err) {
      console.log(
        "error, unable to verify token",
        tokenToVerify,
        "\n",
        accessTokenSecret
      );
      console.log(err);
      console.log(tokenToVerify);
      return res.status(403).json({
        status: "FAILED",
        description: "Unable to verify Credentials",
      });
    }
    const requestedSiteHost = getRequestedSiteHost(req);
    if (!siteMatchesRequest(user.site_id, requestedSiteHost)) {
      return res.status(403).json({
        status: "FAILED",
        description: "User does not belong to the requested site",
      });
    }
    req.user = user;
    next();
  });
};
module.exports = jwtMiddleware;
