
// This is a Test module ...
const neo4j_db = require('../../../config/db');  // neo4j-db
const mysql_db = require('../../../config/db.mysql');  // mysql-db
const geoip = require('geoip-lite');
const lookup = require('country-code-lookup');
const axios  = require('axios');
var dateFormat = require('dateformat');
const { UAParser } = require('ua-parser-js');
const moment = require("moment");
const PREFIX = "/script";
const {
  earlyAccessBetaTestingMail,
  jodTenDollars,
  maintenanceEmail,
  liveDemoEmail,
  backOnlineEmail,
  stableJOD,
  JODSale,
  seasonalGreetings
} = require('../../emailers/core');

const {
  validateQuantity,
  trim,
  sendTelegramAlert,
  validateDomain,
} = require("../../../services/utilities");

const routes = (app) => {

  app.get(PREFIX + "/cssps", function (req, res) {
    let quantity = parseInt(req.query.quantity);
    let message = quantity+' New voucher(s) purchase at GHS '+(quantity * 6);
    let URL = `https://telegram.jibrisondemand.com/cssps?message=${message}`;
    sendTelegramAlert(URL);
    return res.status(200).json(req.body);
  });

    // populate recordings table
    // app.get(PREFIX + "/update-recordings", async function (req, res) {
    //     var db = neo4j_db.get_instance();
    //     db.writeCypher(`MATCH (d:Domain)<-[:STORED]-(r:Recording) RETURN r{.room, .uniqueID, .url, .isRemoved, .removal_at, .created_at, domain_uniqueID: d.uniqueID}`)
    //     .then(async data => {
    //         for (let index = 0; index < data.records.length; index++) {
    //             const neo_record = data.records[index];
    //             let record_props = neo_record._fields[0];
    //             let room = record_props.room;
    //             let url = record_props.url;
    //             let uniqueID = record_props.uniqueID;
    //             let isRemoved = record_props.isRemoved? 1 : 0;
    //             let created_at = moment(record_props.created_at).format("YYYY-MM-DD HH:mm:ss");
    //             let removal_at = moment(record_props.removal_at).format("YYYY-MM-DD HH:mm:ss");
    //             let domain_uniqueID = record_props.domain_uniqueID;
                
    //             let query = "INSERT INTO `recordings`(`room`,`uniqueID`,`domain_uniqueID`,`url`,`removal_at`,`isRemoved`,`created_at`) VALUES (?, ?, ?, ?, ?, ?, ?)";
    //             let results;
    //             try{
    //                 [results] = await mysql_db.execute(query, [room, uniqueID, domain_uniqueID, url, removal_at, isRemoved, created_at]);
    //             }
    //             catch(error){
    //                 console.dir(error);
    //                 return res.json({
    //                     "it": "failed" 
    //                 })
    //             }
    //         }
            
    //         res.json({
    //             "it": "worked",
    //             "message": data.records.length +" recorders have been added to early access table"
    //         });
    //     }, err => {
    //         res.json({
    //             "it": "failed",
    //             err
    //         });
    //     });

    // });

    // populate recorders table
    // app.get(PREFIX + "/update-recorder", async function (req, res) {
    //     var db = neo4j_db.get_instance();
    //     db.writeCypher(`MATCH (d:Deployment)<-[:PROVISIONED_FOR]-(r:Recorder) RETURN 
    //     r{
    //         .ip, 
    //         .jodlet_password, 
    //         .location,
    //         .shutdownTime, 
    //         .removalTime, 
    //         .dropletID, 
    //         .uniqueID,
    //         .isShutdownQueued,
    //         .isRemovalQueued,
    //         .status,
    //         .updated_at,
    //         .created_at,
    //         deployment_uniqueID: d.uniqueID}`)
    //     .then(async data => {
    //         for (let index = 0; index < data.records.length; index++) {
    //             const neo_record = data.records[index];
    //             let record_props = neo_record._fields[0];
    //             let ip = record_props.ip !== null ? record_props.ip : null;
    //             let jodlet_password = record_props.jodlet_password;
    //             let uniqueID = record_props.uniqueID;
    //             let dropletID = record_props.dropletID !== null ? record_props.dropletID : null;
    //             let status = record_props.status;
    //             let location = record_props.location;
    //             let deployment_uniqueID = record_props.deployment_uniqueID;
    //             let isShutdownQueued = record_props.isShutdownQueued ? 1 : 0;;
    //             let isRemovalQueued = record_props.isRemovalQueued ? 1 : 0;;
    //             let shutdownTime = record_props.shutdownTime !== null ? moment(record_props.shutdownTime).format("YYYY-MM-DD HH:mm:ss") : null;
    //             let removalTime = record_props.removalTime !== null ? moment(record_props.removalTime).format("YYYY-MM-DD HH:mm:ss") : null;
    //             let updated_at = moment(record_props.updated_at).format("YYYY-MM-DD HH:mm:ss");
    //             let created_at = moment(record_props.created_at).format("YYYY-MM-DD HH:mm:ss");
                
    //             let query = "INSERT INTO `recorders`(`uniqueID`,`deployment_uniqueID`,`ip`,`jodlet_password`,`location`,`shutdownTime`,`removalTime`,`dropletID`,`isShutdownQueued`,`isRemovalQueued`,`status`,`updated_at`,`created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    //             let results;
    //             try{
    //                 [results] = await mysql_db.execute(query, [uniqueID, deployment_uniqueID, ip, jodlet_password, location, shutdownTime, removalTime, dropletID, isShutdownQueued, isRemovalQueued, status, updated_at, created_at]);
    //             }
    //             catch(error){
    //                 console.dir(error);
    //                 return res.json({
    //                     "it": "failed" 
    //                 })
    //             }
    //         }
            
    //         res.json({
    //             "it": "worked",
    //             "message": data.records.length +" recorders have been added to domains table"
    //         });
    //     }, err => {
    //         res.json({
    //             "it": "failed",
    //             err
    //         });
    //     });

    // });

    // populate deployment table
    // app.get(PREFIX + "/update-deployment", async function (req, res) {
    //     var db = neo4j_db.get_instance();
    //     db.writeCypher(`MATCH (dp:Deployment)-[:HAS]->(d:Domain) RETURN 
    //     dp{
    //         .domain, 
    //         .location, 
    //         .callback_URL,
    //         .available_jibris, 
    //         .how_long_in_hours, 
    //         .number_of_jibris, 
    //         .uniqueID,
    //         .updated_at,
    //         .created_at,
    //         domain_uniqueID: d.uniqueID}`)
    //     .then(async data => {
    //         for (let index = 0; index < data.records.length; index++) {
    //             const neo_record = data.records[index];
    //             let record_props = neo_record._fields[0];
    //             let domain = record_props.domain;
    //             let domain_uniqueID = record_props.domain_uniqueID;
    //             let uniqueID = record_props.uniqueID;
    //             let callback_URL = record_props.callback_URL !== null ? record_props.callback_URL : null;
    //             let location = record_props.location;
    //             let how_long_in_hours = parseInt(record_props.how_long_in_hours);
    //             let number_of_jibris = parseInt(record_props.number_of_jibris);
    //             let available_jibris = parseInt(number_of_jibris);
    //             let updated_at = moment(record_props.updated_at).format("YYYY-MM-DD HH:mm:ss");
    //             let created_at = moment(record_props.created_at).format("YYYY-MM-DD HH:mm:ss");
                
    //             let query = "INSERT INTO `deployments`(`uniqueID`,`domain_uniqueID`,`callback_URL`,`domain`,`location`,`available_jibris`,`how_long_in_hours`,`number_of_jibris`,`updated_at`,`created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    //             let results;
    //             try{
    //                 [results] = await mysql_db.execute(query, [uniqueID, domain_uniqueID, callback_URL, domain, location, available_jibris, how_long_in_hours, number_of_jibris, updated_at, created_at]);
    //             }
    //             catch(error){
    //                 console.dir(error);
    //                 return res.json({
    //                     "it": "failed" 
    //                 })
    //             }
    //         }
            
    //         res.json({
    //             "it": "worked",
    //             "message": data.records.length +" recorders have been added to domains table"
    //         });
    //     }, err => {
    //         res.json({
    //             "it": "failed",
    //             err
    //         });
    //     });

    // });
    
    // populate domain table
    // app.get(PREFIX + "/update-domain", async function (req, res) {
    //     var db = neo4j_db.get_instance();
    //     db.writeCypher(`MATCH (p:Project)<-[:BELONGS]-(d:Domain) RETURN 
    //     d{
    //         .fqdn, 
    //         .uniqueID, 
    //         .jibriUsername, 
    //         .jibriPassword, 
    //         .recorderUsername, 
    //         .recorderPassword,
    //         .uploadServer,
    //         .awsAccessKey,
    //         .awsSecretKey,
    //         .awsBucketName,
    //         .awsDefaultRegion,
    //         .currentStep,
    //         .isDeleted,
    //         .created_at,
    //         project_uniqueID: p.uniqueID}`)
    //     .then(async data => {
    //         for (let index = 0; index < data.records.length; index++) {
    //             const neo_record = data.records[index];
    //             let record_props = neo_record._fields[0];
    //             let fqdn = record_props.fqdn;
    //             let project_uniqueID = record_props.project_uniqueID;
    //             let uniqueID = record_props.uniqueID;
    //             let jibriUsername = record_props.jibriUsername.length > 0 ? record_props.jibriUsername : null;
    //             let jibriPassword = record_props.jibriPassword.length > 0 ? record_props.jibriPassword : null;
    //             let recorderUsername = record_props.recorderUsername.length > 0 ? record_props.recorderUsername : null;
    //             let recorderPassword = record_props.recorderPassword.length > 0 ? record_props.recorderPassword : null;
    //             let uploadServer = record_props.uploadServer.length > 0 ? record_props.uploadServer : null;
    //             let awsAccessKey = record_props.awsAccessKey.length > 0 ? record_props.awsAccessKey : null;
    //             let awsSecretKey = record_props.awsSecretKey.length > 0 ? record_props.awsSecretKey : null;
    //             let awsBucketName = record_props.awsBucketName.length > 0 ? record_props.awsBucketName : null;
    //             let awsDefaultRegion = record_props.awsDefaultRegion.length > 0 ? record_props.awsDefaultRegion : null;
    //             let currentStep = record_props.currentStep;
    //             let isDeleted = record_props.isDeleted? 1 : 0;
    //             let created_at = moment(record_props.created_at).format("YYYY-MM-DD HH:mm:ss");
                
    //             let query = "INSERT INTO `domains`(`fqdn`,`project_uniqueID`,`uniqueID`,`jibriUsername`,`jibriPassword`,`recorderUsername`,`recorderPassword`,`uploadServer`,`awsAccessKey`,`awsSecretKey`,`awsBucketName`,`awsDefaultRegion`,`currentStep`,`isDeleted`,`created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    //             let results;
    //             try{
    //                 [results] = await mysql_db.execute(query, [fqdn, project_uniqueID, uniqueID, jibriUsername, jibriPassword, recorderUsername, recorderPassword, uploadServer, awsAccessKey, awsSecretKey, awsBucketName, awsDefaultRegion, currentStep, isDeleted, created_at]);
    //             }
    //             catch(error){
    //                 console.dir(error);
    //                 return res.json({
    //                     "it": "failed" 
    //                 })
    //             }
    //         }
            
    //         res.json({
    //             "it": "worked",
    //             "message": data.records.length +" recorders have been added to domains table"
    //         });
    //     }, err => {
    //         res.json({
    //             "it": "failed",
    //             err
    //         });
    //     });

    // });

    
    // populate project table
    // app.get(PREFIX + "/update-projects", async function (req, res) {
    //     var db = neo4j_db.get_instance();
    //     db.writeCypher(`MATCH (p:Project)<-[:CREATED]-(u:User) RETURN p{.name, .uniqueID, .isDeleted, .created_at, uuid: u.uuid}`)
    //     .then(async data => {
    //         for (let index = 0; index < data.records.length; index++) {
    //             const neo_record = data.records[index];
    //             let record_props = neo_record._fields[0];
    //             let name = record_props.name;
    //             let uniqueID = record_props.uniqueID;
    //             let isDeleted = record_props.isDeleted? 1 : 0;
    //             let created_at = moment(record_props.created_at).format("YYYY-MM-DD HH:mm:ss");
    //             let uuid = record_props.uuid;
                
    //             let query = "INSERT INTO `projects`(`name`,`uniqueID`,`uuid`,`isDeleted`,`created_at`) VALUES (?, ?, ?, ?, ?)";
    //             let results;
    //             try{
    //                 [results] = await mysql_db.execute(query, [name, uniqueID, uuid, isDeleted, created_at]);
    //             }
    //             catch(error){
    //                 console.dir(error);
    //                 return res.json({
    //                     "it": "failed" 
    //                 })
    //             }
    //         }
            
    //         res.json({
    //             "it": "worked",
    //             "message": data.records.length +" recorders have been added to early access table"
    //         });
    //     }, err => {
    //         res.json({
    //             "it": "failed",
    //             err
    //         });
    //     });

    // });
    
    // populate users table
    // app.get(PREFIX + "/update-users", async function (req, res) {
    //     var db = neo4j_db.get_instance();
    //     db.writeCypher(`MATCH (u:User) RETURN u`)
    //     .then(async data => {
    //         for (let index = 0; index < data.records.length; index++) {
    //             const neo_record = data.records[index];
    //             let record_props = neo_record._fields[0].properties;
    //             let email = record_props.email;
    //             let password = record_props.password;
    //             let balance = parseFloat(record_props.balance).toFixed(2);
    //             let isBetaUser = record_props.isBetaUser? 1 : 0;
    //             let email_verification_status = record_props.email_verification_status? 1 : 0;
    //             let email_verification_code = record_props.email_verification_code;
    //             let apiKey = record_props.apiKey;
    //             let name = record_props.name;
    //             let country = record_props.country;
    //             let created_at = moment(record_props.created_at, "dddd, MMMM Do YYYY, h:mm:ss a").format("YYYY-MM-DD HH:mm:ss");
    //             let uuid = record_props.uuid;
                
    //             let query = "INSERT INTO `users`(`uuid`,`name`,`email`,`password`,`balance`,`isBetaUser`,`email_verification_code`,`email_verification_status`,`apiKey`,`country`,`created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    //             let results;
    //             try{
    //                 [results] = await mysql_db.execute(query, [uuid, name, email, password, balance, isBetaUser, email_verification_code, email_verification_status, apiKey, country, created_at]);
    //             }
    //             catch(error){
    //                 console.dir(error);
    //                 return res.json({
    //                     "it": "failed" 
    //                 })
    //             }
    //         }
            
    //         res.json({
    //             "it": "worked",
    //             "message": data.records.length +" recorders have been added to early access table"
    //         });
    //     }, err => {
    //         res.json({
    //             "it": "failed",
    //             err
    //         });
    //     });

    // });

    // populate early access table
    // app.get(PREFIX + "/update-earlyaccess", async function (req, res) {
    //     var db = neo4j_db.get_instance();
    //     db.writeCypher(`MATCH (u:EarlyAccess) RETURN u`)
    //     .then(async data => {
    //         for (let index = 0; index < data.records.length; index++) {
    //             const neo_record = data.records[index];
    //             let record_props = neo_record._fields[0].properties;
    //             let email = record_props.email;
    //             let full_name = record_props.full_name;
    //             let country = record_props.country;
    //             let created_at = moment(record_props.created_at, "dddd, MMMM Do YYYY, h:mm:ss a").format("YYYY-MM-DD HH:mm:ss");
    //             let uuid = record_props.uuid;
    //             let jibris = record_props.jibris;
                
    //             let q = "INSERT INTO `early_access`(`uuid`,`full_name`,`email`,`country`,`jibris`,`created_at`) VALUES ("+uuid+", "+full_name+", "+full_name+", "+country+", "+jibris+", "+created_at+")";

    //             let query = "INSERT INTO `early_access`(`uuid`,`full_name`,`email`,`country`,`jibris`,`created_at`) VALUES (?, ?, ?, ?, ?, ?)";
    //             let results;
    //             try{
    //                 [results] = await mysql_db.execute(query, [uuid, full_name, email, country, jibris, created_at]);
    //             }
    //             catch(error){
    //                 console.dir(error);
    //                 return res.json({
    //                     "it": "failed",
    //                     // "query": q  
    //                 })
    //             }
    //         }
            
    //         res.json({
    //             "it": "worked",
    //             "message": data.records.length +" recorders have been added to early access table"
    //         });
    //     }, err => {
    //         res.json({
    //             "it": "failed",
    //             err
    //         });
    //     });

    // });

    // callback test endpoint
    app.post(PREFIX + "/callback", function (req, res) {
        console.log("********************this just came from a deployment callback***************")
        console.dir(req.body);
        return res.status(200).json(req.body);
    });
    
    // send maintenance email to all users
    // app.get(PREFIX+'/email-all-users', function(req, res){
    //     // Get Some DATA
        
    //     let auth = req.query.auth;
    //     if(auth !== "youtube@X123"){
    //       return res.json({
    //         it: "failed",
    //         reason: "ma guy relax, where you from",
    //       });
    //     }

    //     var db = neo4j_db.get_instance();
    //     db.writeCypher(`MATCH (u:User) RETURN u`)   
    //     .then(data => {
    //         for (let index = 0; index < data.records.length; index++) {
    //             const neo_record = data.records[index];
    //             let record_props = neo_record._fields[0].properties;
    //             let email = record_props.email;
    //             let full_name = record_props.name;

    //             maintenanceEmail(email, full_name);
                
    //         }

    //         res.json({
    //             status: "success",
    //             requests: `Emailed ${data.records.length} users`
    //         }); 
            
    //     }, err => {
    //         res.json({
    //             "it": "failed",
    //             err
    //         });
    //     });
    // });

    // send service restoration email to all users
    // app.get(PREFIX+'/email-all-users-restoration', async function(req, res){
    //     // Get Some DATA
        
    //     let auth = req.query.auth;
    //     if(auth !== "youtube@X123"){
    //       return res.json({
    //         it: "failed",
    //         reason: "ma guy relax, where you from",
    //       });
    //     }

    //     let query = "SELECT `email`, `name` FROM `users` WHERE 1";
    //     let results;
    //     try{
    //         [results] = await mysql_db.execute(query);
    //     }
    //     catch(error){
    //         console.dir(error)
    //         return res.json({
    //             "it": "failed"   
    //         })
    //     }

    //     for (let i = 0; i < results.length; i++) {
    //         let email = results[i].email;
    //         let full_name = results[i].name;

    //         backOnlineEmail(email, full_name);
            
    //     }

    //     res.json({
    //         status: "success",
    //         requests: `Emailed ${results.length} users`
    //     }); 
    // });

    // send demo call email to all users
    // app.get(PREFIX+'/email-for-live-demo', async function(req, res){
    //     // Get Some DATA
        
    //     let auth = req.query.auth;
    //     if(auth !== "youtube@X123"){
    //       return res.json({
    //         it: "failed",
    //         reason: "ma guy relax, where you from",
    //       });
    //     }

    //     let query = "SELECT `email`, `name` FROM `users` WHERE `demoCallDone` = 0";
    //     let results;
    //     try{
    //         [results] = await mysql_db.execute(query);
    //     }
    //     catch(error){
    //         console.dir(error)
    //         return res.json({
    //             "it": "failed"   
    //         })
    //     }

    //     for (let i = 0; i < results.length; i++) {
    //         let email = results[i].email;
    //         let full_name = results[i].name;

    //         liveDemoEmail(email, full_name);
            
    //     }

    //     let earlyAccessQuery = "SELECT `email`, `full_name` FROM `early_access` WHERE `email` NOT IN (SELECT `email` FROM `users`)";
    //     let earlyAccess;
    //     try{
    //         [earlyAccess] = await mysql_db.execute(earlyAccessQuery);
    //     }
    //     catch(error){
    //         console.dir(error)
    //         return res.json({
    //             "it": "failed"   
    //         })
    //     }

    //     for (let i = 0; i < earlyAccess.length; i++) {
    //         let email = earlyAccess[i].email;
    //         let full_name = earlyAccess[i].full_name;

    //         liveDemoEmail(email, full_name);
            
    //     }

    //     res.json({
    //         status: "success",
    //         requests: `Emailed ${results.length + earlyAccess.length} users`
    //     }); 
    // });


    // send seasonal greetings email to all users
    // app.get(PREFIX+'/jod-sale', async function(req, res){
    //     // Get Some DATA
        
    //     let auth = req.query.auth;
    //     if(auth !== "youtube@X123"){
    //       return res.json({
    //         it: "failed",
    //         reason: "ma guy relax, where you from",
    //       });
    //     }

    //     let query = "SELECT `email`, `name` FROM `users` WHERE 1";
    //     let results;
    //     try{
    //         [results] = await mysql_db.execute(query);
    //     }
    //     catch(error){
    //         console.dir(error)
    //         return res.json({
    //             "it": "failed"   
    //         })
    //     }

    //     for (let i = 0; i < results.length; i++) {
    //         let email = results[i].email;
    //         // let full_name = results[i].name;

    //         JODSale(email);
            
    //     }

    //     let earlyAccessQuery = "SELECT `email`, `full_name` FROM `early_access` WHERE `email` NOT IN (SELECT `email` FROM `users`)";
    //     let earlyAccess;
    //     try{
    //         [earlyAccess] = await mysql_db.execute(earlyAccessQuery);
    //     }
    //     catch(error){
    //         console.dir(error)
    //         return res.json({
    //             "it": "failed"   
    //         })
    //     }

    //     for (let i = 0; i < earlyAccess.length; i++) {
    //         let email = earlyAccess[i].email;
    //         // let full_name = earlyAccess[i].full_name;

    //         JODSale(email);
            
    //     }

    //     res.json({
    //         status: "success",
    //         requests: `Emailed ${results.length + earlyAccess.length} users`
    //     }); 
    // });

}
 
module.exports = {
   routes
}