// This is a Test module ...
const db = require('../../../config/db');  // neo4j-db
const mysql_db = require('../../../config/db.mysql');  // neo4j-db
const geoip = require('geoip-lite');
const lookup = require('country-code-lookup');
const axios  = require('axios');
const isPortReachable = require('is-port-reachable');
const AWS = require('aws-sdk');
// var redis = require("redis");
// var client = redis.createClient();
const fs = require('fs');

var dateFormat = require('dateformat');
const { UAParser } = require('ua-parser-js');
const { sendTelegramAlert } = require('../../../services/utilities');
const PREFIX = "/test";

// client.on("connect", function () {
//    console.log("Redis DB Connected!");
// });


const uploadFile = (awsConfig, fileName, s3file='test.txt', successCallback, failureCallback) => {
    
    // const BUCKET_NAME = 'jod-recordings';
    const BUCKET_NAME = awsConfig.bucket;

    const s3 = new AWS.S3({
        accessKeyId: awsConfig.id,
        secretAccessKey: awsConfig.secret,
        region: awsConfig.region
    });

    // Read content from the file
    const fileContent = fs.readFileSync(fileName);
    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: s3file, // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            failureCallback(err);
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        successCallback(data.Location,data);
    });
};

const routes = (app) => {
    
    // insert into the database
    app.get(PREFIX+'/telegram', function(req, res){
        // Get Some DATA
        var parser = new UAParser();
        var uastring3 = req.headers['user-agent'];
        var stamp = dateFormat(new Date(), "h:MM:ss dd-mm-yyyy");
        parser.setUA(uastring3);
        var device = parser.getOS().name + " " + parser.getBrowser().name;
        var getClientAddress = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
        var geo = geoip.lookup(getClientAddress);
        var countryCode = geo.country === undefined ? null : geo.country;
        var country = null;
        if(countryCode!= null){
        var obj = lookup.byIso(countryCode);
            country = obj.continent+" > "+obj.region+" > "+obj.country;
        }

        // THE EXAMPLE CODE ACTUALLY STARTS FROM HERE


        let message = `Request from ${country} on this device ${device}`;
        let URL = `https://telegram.jibrisondemand.com/msg/early/access?message=${message}`;
        // @REK take note of the BASIC AUTH headers being passed in ...
        axios.get(URL, {auth: {username: process.env.HTTP_BASIC_AUTH_USER,password: process.env.HTTP_BASIC_AUTH_PASS}})
        .then((data)=> {
            res.json({
                "it": "worked"
            });
        }).catch((err) => {
            console.log("Error from request");
            console.dir(err);
            res.json({
                "it": "failed",
                err
            });
        });
    });

    // insert into the database
    app.get(PREFIX+'/dbi', function(req, res){
        var parser = new UAParser();
        var uastring3 = req.headers['user-agent'];
        var stamp = dateFormat(new Date(), "h:MM:ss dd-mm-yyyy");
        parser.setUA(uastring3);
        var device = parser.getOS().name + " " + parser.getBrowser().name;
        var getClientAddress = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
        var geo = geoip.lookup(getClientAddress);
        var countryCode = geo.country === undefined ? null : geo.country;
        var country = null;
        if(countryCode!= null){
        var obj = lookup.byIso(countryCode);
            country = obj.continent+" > "+obj.region+" > "+obj.country;
        }
        var city = geo.city === undefined ? null : geo.city;
        var geo_str = JSON.stringify(geo);
   });

   app.get(PREFIX+'/aws-test', function(req, res){
    // aws_key_id=test.appcost.me&aws_secret=aswiOFFojzJkBM6hK4ae7iHc2sYiHgGcX3ubeRr1&aws_region=eu-central-1&aws_bucket=jod-recordings
        var aws_key_id = req.query.aws_key_id;
        var aws_secret = req.query.aws_secret;
        var aws_region = req.query.aws_region;
        var aws_bucket = req.query.aws_bucket;

        var awsConfig = {
            bucket: aws_bucket,
            id: aws_key_id,
            secret: aws_secret,
            region: aws_region
        };    

        uploadFile(awsConfig, "./test.md", "jod/test/readme.md", (link, data) => {
            res.json({
                "it": "worked",
                "link": link,
                "data": data
            })
        }, (err) => {
            res.json({
                "it": "failed",
                "err": err
            })
        })
   
    });

   app.get(PREFIX+'/port-test', async function(req, res){
        var port = req.query.port;
        var domain = req.query.domain;
        var status = await isPortReachable(port, {host: domain});
        res.json({
            "domain": domain,
            "status": status
        })
    });

   app.get(PREFIX+'/deposit', async function(req, res){
        var port = req.query.port;
        var domain = req.query.domain;
        var money = 100.00;

        // send an alert to Telegram
        let message = `New Deposit of ${money}`;
        let URL = `https://telegram.jibrisondemand.com/new_payment?message=${message}`;
        sendTelegramAlert(URL);

        res.json({
                "status": "success"
        })
    });

    app.get(PREFIX+'/deployment-json', function(req, res){
        var deployment_id = req.query.id;
        let batch_redis_key = "deploy_"+deployment_id;
        client.get(batch_redis_key, function (err, reply) {
            var recorders = JSON.parse(reply);
            res.json({
                "data": recorders,
                id: deployment_id,
                batch_redis_key
            })
        });
    });



    app.get(PREFIX+'/mysql', async function(req, res){
        let query = "SELECT * FROM early_access;";
        let results;
        try{
            [results] = await mysql_db.execute(query, []);
        }
        catch(error){
            res.json({
                "it": "failed"   
            })    
            return;
        }
        res.json({
            "it": "worked",
            "list": results     
        });
    });


   // read database
   app.get(PREFIX+'/dbr', function(req, res){
        var db = neo4j_db.get_instance();
        db.writeCypher('MATCH (n:TestRequest) RETURN n', {})   
        .then(data => {
            var list_of_items  = [];
            for (let index = 0; index < data.records.length; index++) {
                const neo_record = data.records[index];
                let record_props = neo_record._fields[0].properties;
                record_props.labels = neo_record._fields[0].labels;
                list_of_items.push(record_props);
            }
            res.json({
                status: "success",
                requests: list_of_items
            }); 
        }, err => {
            res.json({
                "it": "failed",
                err
            });
        });
    });
}
 
module.exports = {
   routes
}