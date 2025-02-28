
const neo4j_db = require('../../../config/db');  // neo4j-db
const mysql_db = require('../../../config/db.mysql');  // mysql-db
// var redis = require("redis");
// var client = redis.createClient(); //creates a new client
var moment = require('moment-timezone');
var dateFormat = require('dateformat');

// client.on("connect", function () {
//    console.log("Redis DB Connected!");
// });

const PREFIX = "/deployment";

const routes = (app) => {

   // success callback
   app.post(PREFIX+'/success', async function(req, res){
      // input vars
      let deployment_id = req.body.deployment_id; // | "888"; // deployment_id
      let recorder_identifier = req.body.recorder_identifier; //| "777"; // recorder_identifier
      let do_id = req.body.do_id; // digital_ocean_id

      console.log("SUCCESS CALLBACK Reveived from Bull Scheduler: DO ID is: "+do_id+"---"+recorder_identifier+"---"+deployment_id);
      // TOOD: Recorder by recorder basis
      let updateRecorderQuery = "UPDATE `recorders` SET `dropletID` = ?, `status` = 'deployed' WHERE `uniqueID` = ?";
      let updateRecorder;
      try{
         [updateRecorder] = await mysql_db.execute(updateRecorderQuery, [do_id, recorder_identifier]);
      }
      catch(error){
         console.dir(error)
         return res.json({
            "it": "failed"   
         }) 
      }

      return res.json({
         "status": "success",
         "jodlet_protocol_version": "1.0.0"
      });

   });

   // failure callback
   app.post(PREFIX+'/failure', async function(req, res){
      // input vars
      let deployment_id = req.body.deployment_id ;//| "888"; // deployment_id
      let recorder_identifier = req.body.recorder_identifier;// | "777"; // recorder_identifier

      console.log("FAILURE CALLBACK Reveived from Bull Scheduler: Deployment ID is: "+deployment_id);
      // FLAG that this deployment and recorder failed

      let updateRecorderQuery = "UPDATE `recorders` SET `status` = 'failed' WHERE `uniqueID` = ?";
      let updateRecorder;
      try{
         [updateRecorder] = await mysql_db.execute(updateRecorderQuery, [recorder_identifier]);
      }
      catch(error){
         console.dir(error)
         return res.json({
            "it": "failed"   
         }) 
      }

      return res.json({
         "status": "success",
         "jodlet_protocol_version": "1.0.0"
      });

   });


   // removal success
   app.post(PREFIX+'/removal/success', async function(req, res){
      // input vars
      let do_id = req.body.do_id; // digital_ocean_id

      console.log("SUCCESS CALLBACK Reveived from Bull Scheduler: DO ID is: "+do_id);

      let updateRecorderQuery = "UPDATE `recorders` SET `status` = 'removed' WHERE `dropletID` = ?";
      let updateRecorder;
      try{
         [updateRecorder] = await mysql_db.execute(updateRecorderQuery, [do_id]);
      }
      catch(error){
         console.dir(error)
         return res.json({
            "it": "failed"   
         }) 
      }

      return res.json({
         "status": "success",
         "jodlet_protocol_version": "1.0.0"
      });

   });

   // removal failure
   app.post(PREFIX+'/removal/failure', async function(req, res){

      let do_id = req.body.do_id; // digital_ocean_id

      console.log("SUCCESS CALLBACK Reveived from Bull Scheduler: DO ID is: "+do_id);
      
      let updateRecorderQuery = "UPDATE `recorders` SET `isRemovalQueued` = 0 WHERE `dropletID` = ?";
      let updateRecorder;
      try{
         [updateRecorder] = await mysql_db.execute(updateRecorderQuery, [do_id]);
      }
      catch(error){
         console.dir(error)
         return res.json({
            "it": "failed"   
         }) 
      }

      return res.json({
         "status": "success",
         "jodlet_protocol_version": "1.0.0"
      });

   });


   // removal success
   app.post(PREFIX+'/shutdown/success', async function(req, res){
      // input vars
      let ip_address = req.body.ip_address; // digital_ocean_id

      console.log("SUCCESS CALLBACK Reveived from Bull Scheduler: DO ID is: "+ip_address);
      
      let updateRecorderQuery = "UPDATE `recorders` SET `status` = 'shutdown' WHERE `ip` = ?";
      let updateRecorder;
      try{
         [updateRecorder] = await mysql_db.execute(updateRecorderQuery, [ip_address]);
      }
      catch(error){
         console.dir(error)
         return res.json({
            "it": "failed"   
         }) 
      }

      return res.json({
         "status": "success",
         "jodlet_protocol_version": "1.0.0"
      });
      

   });

   // removal failure
   app.post(PREFIX+'/shutdown/failure', async function(req, res){

      let ip_address = req.body.ip_address; // digital_ocean_id

      console.log("SUCCESS CALLBACK Reveived from Bull Scheduler: DO ID is: "+ip_address);
      
      let updateRecorderQuery = "UPDATE `recorders` SET `isShutdownQueued` = 0 WHERE `ip` = ?";
      let updateRecorder;
      try{
         [updateRecorder] = await mysql_db.execute(updateRecorderQuery, [ip_address]);
      }
      catch(error){
         console.dir(error)
         return res.json({
            "it": "failed"   
         }) 
      }

      return res.json({
         "status": "success",
         "jodlet_protocol_version": "1.0.0"
      });

   });
   
}
 
module.exports = {
   routes
}