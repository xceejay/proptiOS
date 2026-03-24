const neo4j_db = require("../../../config/db"); // neo4j-db + OGM
const mysql_db = require("../../../config/db.mysql"); // mysql-db
const EG = require("../../../config/security");
const bcrypt = require("bcryptjs");
const JOD = require("../../../config/security");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { UAParser } = require("ua-parser-js");
var uuid = require("uuid-random");
var dateFormat = require("dateformat");
var ECN = require("../../../config/constants");
var includes = require("array-includes");
const shortid = require("shortid");
const axios = require("axios");
const numbro = require("numbro");
const geoip = require("geoip-lite");
const lookup = require("country-code-lookup");
const { client, xml, jid } = require("@xmpp/client");
const debug = require("@xmpp/debug");
const curl = require("curl");
var Queue = require("bull");
// var redis = require("redis");
const { exec } = require("child_process");
const isPortReachable = require("is-port-reachable");
const AWS = require("aws-sdk");
const fs = require("fs");

const { customAlphabet } = require("nanoid");
const nanoid_shortest = customAlphabet(
  "123456789AbcDeFkLPzZQqRrMmNWwBEGgHhJSTtUuXx",
  6
);

// var redisClient = redis.createClient(); //creates a new client

const { earlyAccessMail, recordingTempLink } = require("../../emailers/core");

const {
  validateQuantity,
  trim,
  sendTelegramAlert,
  validateDomain,
} = require("../../../services/utilities");
const x = require("uniqid");
const { stat } = require("fs");
const secret = "mysecretsshhh";
const PREFIX = "/client";

const uploadFile = (
  awsConfig,
  fileName,
  s3file = "test.txt",
  successCallback,
  failureCallback
) => {
  // const BUCKET_NAME = 'jod-recordings';
  const BUCKET_NAME = awsConfig.bucket;

  const s3 = new AWS.S3({
    accessKeyId: awsConfig.id,
    secretAccessKey: awsConfig.secret,
    region: awsConfig.region,
  });

  // Read content from the file
  const fileContent = fs.readFileSync(fileName);
  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: s3file, // File name you want to save as in S3
    Body: fileContent,
  };

  // Uploading files to the bucket
  s3.upload(params, function (err, data) {
    if (err) {
      failureCallback(err);
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
    successCallback(data.Location, data);
  });
};

function execShellCommand(cmd) {
  const exec = require("child_process").exec;
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve({
        err: error,
        stdout,
        stderr,
      });
    });
  });
}

const validateJitsiDomain = async (domain) => {
  let url = `https://${domain}/interface_config.js`;
  try {
    const response = await axios.get(url);
    if (response.data.includes('TOOLBAR_BUTTONS')) {
      console.log("See the output");
      console.log(response.data);
      return true;
    }
    return true;
  } catch (error) {
    console.log("See the error:");
    console.dir(error);
    // return false;
    return true;
  }
};

const validateJitsiDomainPort = async (domain) => {
  let port = 5222;
  var status = await isPortReachable(port, { host: domain });
  return status;
};

const validateAWSCred = (
  aws_key_id,
  aws_secret,
  aws_region,
  aws_bucket,
  successCallBack,
  failureCallback
) => {
  var awsConfig = {
    bucket: aws_bucket,
    id: aws_key_id,
    secret: aws_secret,
    region: aws_region,
  };

  uploadFile(
    awsConfig,
    "./test.md",
    "jod/test/readme.md",
    (link, data) => {
      console.log("IT WORKS. SUCCESS! AWS Tested!");
      console.dir(data);
      console.dir(link);
      successCallBack(link);
    },
    (err) => {
      console.dir(err);
      failureCallback(err);
    }
  );
};


const routes = (app) => {
  // client dummy
  app.post(PREFIX + "/dummy", function (req, res) {
    return res.json({
      it: "worked",
      data: req.body,
      req: req,
    });
  

  
  
  
  
  });


  
  app.post(PREFIX + "/test-endpoint", function (req, res) {
    return res.json( stringify({
      it: "worked",
      data: req.body,
      // req: req,
    }));
  });

}



function stringify(obj) {
  let cache = [];
  let str = JSON.stringify(obj, function(key, value) {
    if (typeof value === "object" && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // reset the cache
  return str;
}


module.exports = {
  routes,
};
