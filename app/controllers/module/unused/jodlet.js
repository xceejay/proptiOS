
const neo4j_db = require('../../../config/db');  // neo4j-db
const mysql_db = require('../../../config/db.mysql');  // mysql-db
// var redis = require("redis");
// var client = redis.createClient(); //creates a new client
const moment = require('moment');
var dateFormat = require('dateformat');
const axios = require("axios");

// client.on("connect", function () {
//    console.log("Redis DB Connected!");
// });

const PREFIX = "/jodlet";

const routes = (app) => {

   // presence and status update
   app.post(PREFIX+'/status/update', async function(req, res){
      let deployment_id = req.body.deployment_id;
      let domain = req.body.domain;
      let ip = req.body.ip;
      let memory = req.body.memory;
      let cpu = req.body.cpu;
      let jibri_log = req.body.jibri_log;
      let ffmpeg_log = req.body.ffmpeg_log;
      let browser_log = req.body.browser_log;
      let xorg_log = req.body.xorg_log;

      let do_id = (req.body.do_id).toString();
      let jibri_payload =  req.body.jibri_payload;

      let batch_redis_key = "deploy_"+deployment_id;
      let update_received_at = moment.utc().format();
      var status_msg = "updated";
      console.log("IP from server: "+ip);

      let getDeploymentInfoQuery = "SELECT * FROM `deployments` WHERE `uniqueID` = ?";
      let getDeploymentInfo;
      try{
         [getDeploymentInfo] = await mysql_db.execute(getDeploymentInfoQuery, [deployment_id]);
      }
      catch(error){
         console.dir(error)
         return res.json({
            "it": "failed"   
         }) 
      }
      
      if(getDeploymentInfo.length > 0){
         let deployment_duration = getDeploymentInfo[0].how_long_in_hours;
         let number_of_jibris = parseInt(getDeploymentInfo[0].number_of_jibris);
         let available_jibris = parseInt(getDeploymentInfo[0].available_jibris);
         let callback_url = getDeploymentInfo[0].callback_URL;

         let removalTime = moment().add(deployment_duration, 'hours').add(30, 'minutes').format("YYYY-MM-DD HH:mm:ss");
         let shutdownTime = moment().add(deployment_duration, 'hours').format("YYYY-MM-DD HH:mm:ss");

         let updateRecorderInfoQuery = "UPDATE `recorders` SET `ip` = ?, `status` = 'available', `isRemovalQueued` = 0, `isShutdownQueued` = 0, `removalTime` = ?, `shutdownTime` = ? WHERE `dropletID` = ? AND `ip` IS NULL";
         let updateRecorderInfo;
         try{
            [updateRecorderInfo] = await mysql_db.execute(updateRecorderInfoQuery, [ip, removalTime, shutdownTime, do_id]);
         }
         catch(error){
            console.dir(error)
            return res.json({
               "it": "failed"   
            }) 
         }

         available_jibris++;
         if(number_of_jibris >= available_jibris){
            let updateDeploymentInfoQuery = "UPDATE `deployments` SET `available_jibris` = ? WHERE `uniqueID` = ? ";
            let updateDeploymentInfo;
            try{
               [updateDeploymentInfo] = await mysql_db.execute(updateDeploymentInfoQuery, [available_jibris, deployment_id]);
            }
            catch(error){
               console.dir(error)
               return res.json({
                  "it": "failed"   
               }) 
            }
         }
         
         if(number_of_jibris === available_jibris && callback_url != null){
            let getRecordersQuery = "SELECT `uniqueID`, `ip` FROM `recorders` WHERE `deployment_uniqueID` = ?";
            let getRecorders;
            try{
               [getRecorders] = await mysql_db.execute(getRecordersQuery, [deployment_id]);
            }
            catch(error){
               console.dir(error)
               return res.json({
                  "it": "failed"   
               }) 
            }


            let response_data = {
               it : "worked",
               response : "deployment successful",
               deployment_info : {
                  deployment_id : deployment_id,
                  reocrders : getRecorders
              }
            }

            axios.post(callback_url, response_data)
            .then((data)=> {
                  // response = true;
            }).catch((err) => {
                  console.log("Error from callback request");
                  console.dir(err);
            });
         }
      }
    

      client.get(batch_redis_key, function (err, reply) {
         var recorders = JSON.parse(reply);
         // If the array does not exist, meaning this is the first occurrence of the deployment and the recorder
         if (!Array.isArray(recorders)) {
           recorders = [
            {
               deployment_id: deployment_id,
               domain: domain,
               deleted: false,
               ip_address: ip,
               do_id: do_id,
               memory: memory,
               cpu: cpu,
               "jibri_payload": jibri_payload,
               updated_at: update_received_at
             },
           ];
            
           console.log("Deployment Created - Initialization Received from Jodlet ("+ip+")")
           status_msg = "created";
           client.set(batch_redis_key, JSON.stringify(recorders)); // save in redis!
           console.log("Saved in DB");
         } 
         // if the array exists, simply find the recorder and update it. Otherwise create a new one.
         else {
            let payload = {
               deployment_id: deployment_id,
               domain: domain,
               ip_address: ip,
               deleted: false,
               do_id: do_id,
               memory: memory,
               cpu: cpu,
               "jibri_payload": jibri_payload,
               updated_at: update_received_at
            };
            let doesRecorderExist = false;
            for (let index = 0; index < recorders.length; index++) {
               const recorder = recorders[index];
               if(recorder.deleted == false && recorder.ip_address == ip && recorder.do_id == do_id){
                  recorders[index] = payload;
                  doesRecorderExist  = true;
                  break;
               }
            }

            if(!doesRecorderExist){
               recorders.push(payload);
               console.log("New Recorder Registered ("+ip+")");
               client.set(batch_redis_key, JSON.stringify(recorders)); // save in redis!
               console.log("Saved in DB");

            }
            else {
               console.log("Update Received from existing Jodlet ("+ip+")")
               client.set(batch_redis_key, JSON.stringify(recorders)); // save in redis!
               console.log("Saved in DB");
            }
         }
         // return the result. Now assuming this is all synchronous code,
         res.json({
            "status": status_msg,
            "jodlet_protocol_version": "1.0.0"
         });
       });
   });

   
   app.get(PREFIX+'/status/all', function(req, res){
      // input vars
      let deployment_id = req.query.deployment_id;
      let batch_redis_key = "deploy_"+deployment_id;

      client.get(batch_redis_key, function (err, reply) {
         var recorders = JSON.parse(reply);
         var final = [];
         if(recorders == null){
            recorders = [];
         }

         for (let index = 0; index < recorders.length; index++) {
            const rec = recorders[index];
            if(rec.deleted == false){
               final.push(rec);
            }
         }
         
         res.json({
            "deployment_id": deployment_id,
            "recorders": final,
            "jodlet_protocol_version": "1.0.0"
         });
      });

   });

   // presence
   app.post(PREFIX+'/dummy/update', function(req, res){
      let deployment_id = req.body.deployment_id;
      let domain = req.body.domain;
      let ip = req.body.ip;
      let do_id = req.body.do_id;
      let jibri_payload =  req.body.jibri_payload;

      let batch_redis_key = "deploy_"+deployment_id;
      let update_received_at = moment.utc().format();
      var status_msg = "updated";

      client.get(batch_redis_key, function (err, reply) {
         var recorders = JSON.parse(reply);
         if (!Array.isArray(recorders)){
           recorders = [
             {
               deployment_id: deployment_id,
               domain: domain,
               deleted: false,
               ip_address: ip,
               do_id: do_id,
               "jibri_payload": jibri_payload,
               updated_at: update_received_at
             }
           ];
           console.log("First Array Initialization Received from Jodlet")
           status_msg = "created";
           console.dir(recorders);
           client.set(batch_redis_key, JSON.stringify(recorders)); // save in redis!
           console.log("Saved in DB");
         } 
         else {
            let payload = {
               deployment_id: deployment_id,
               domain: domain,
               ip_address: ip,
               deleted: false,
               do_id: do_id,
               "jibri_payload": jibri_payload,
               updated_at: update_received_at
            };

            let doesRecorderExist = false;
            for (let index = 0; index < recorders.length; index++) {
               const recorder = recorders[index];
               if(recorder.deleted == false && recorder.ip_address == ip && recorder.do_id == do_id){
                  recorders[index] = payload;
                  doesRecorderExist  = true;
                  break;
               }
            }

            if(!doesRecorderExist){
               recorders.push(payload);
               console.log("On Update New Recorder Registered ("+ip+")");
               client.set(batch_redis_key, JSON.stringify(recorders)); // save in redis!
               console.log("Saved in DB");
         
            }
            else {
               console.log("Update Received from existing Jodlet ("+ip+")")
               console.dir(req.body);
               client.set(batch_redis_key, JSON.stringify(recorders)); // save in redis!
               console.log("Saved in DB");
            }
         }

         res.json({
            "status": status_msg,
            "jodlet_protocol_version": "1.0.0"
         });
       });
   });
}
 
module.exports = {
   routes
}