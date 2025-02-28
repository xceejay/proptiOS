// Routes Related to Basic CRUD Operations

const neo4j_db = require('../../../config/db');  // neo4j-db

const routes = (app) => {
   
   // GET ALL
   app.get('/rect/all', function(req, res){
      var db = neo4j_db.get_instance();
      db.writeCypher('MATCH (u:Rectangle) RETURN *, u',{})
      .then(data => {

         data.records.forEach(function (record) {
            // TODO: Process data
         });

         res.json({
            "it": "worked",
            "payload": data.records
         });
      }, err => {
         res.json({
            "it" : "failed",
            "reason": err
         });
      })
   });

   // GET ONE /rect/:id
   app.get('/rect/:uuid', function(req, res){
      var db = neo4j_db.get_instance();
      let uuid = req.params.uuid;

      db.writeCypher('MATCH (u:Rectangle) WHERE u.uuid = $ident RETURN u',{ ident: uuid })
      .then(data => {

         if(data.records.length > 0){
            // Just one item
            res.json({
               "it": "worked",
               "rectangle": data.records[0]
            });
         }
         else {
            res.json({
               "it": "failed",
               "reason": "not_found"
            });
         }
         
      }, err => {
         console.dir(err);
         res.json({
            "it" : "failed",
            "reason": err
         });
      })
   });

   // CREATE ONE
   app.post('/rect/create', function(req, res){
      let name = req.body.name;
      let width = parseInt(req.body.width);
      let height = parseInt(req.body.height);

      var db = neo4j_db.get_instance();
      db.writeCypher('CREATE (u:Rectangle {name: $name, width: $width, height: $height, uuid: randomUUID()}) RETURN u',{ name, width, height })
      .then(data => {

         res.json({
            "it": "worked",
            "payload": data.records,
            "new_rectangle": data.records[0]
         });

      }, err => {
         console.dir(err);
         res.json({
            "it" : "failed",
            "reason": err
         });
      })

   });

   // UPDATE ONE
   app.put('/rect/:uuid/update', function(req, res){
      var db = neo4j_db.get_instance();
      let uuid = req.params.uuid;
      
      // Rectangle Props
      let name = req.body.name;
      let width = parseInt(req.body.width);
      let height = parseInt(req.body.height);

      db.writeCypher('MATCH (u:Rectangle) WHERE u.uuid = $ident SET u.name=$name, u.width=$width, u.height=$height RETURN u;', { ident: uuid, name:name, width:width, height:height})
      .then(data => {
         if(data.records.length > 0){
            res.json({
               "it": "worked",
               "payload": data.records,
               "updated_rectangle": data.records[0]
            });
         }
         else {
            res.json({
               "it": "failed",
               "reason": "not_found"
            });
         }
      }, err => {
         console.dir(err);
         res.json({
            "it" : "failed",
            "reason": err
         });
      })
   });

   // DELETE ONE
   app.delete('/rect/:uuid/delete', function(req, res){
      var db = neo4j_db.get_instance();
      let uuid = req.params.uuid;

      db.writeCypher('MATCH (u:Rectangle) WHERE u.uuid = $ident DELETE u;', { ident: uuid })
      .then(data => {
         res.json({
            "it": "worked",
            "payload": data.records,
            "status": "deleted"
         });
      }, err => {
         console.dir(err);
         res.json({
            "it" : "failed",
            "reason": err
         });
      })
   });

   // PAGINATION
   app.get('/rect/page/:page_number/:limit', function(req, res){
      let page_number = parseInt(req.query.page_number);
      let limit =  parseInt(req.query.limit);

      let i = page_number - 1;
      let skip_amount = i * limit;

      var db = neo4j_db.get_instance();
      // Issue with Neo4j: Cannot serialize integers properly. Turns them into single precision floats. This is a workaround
      // Issue link: https://community.neo4j.com/t/param-and-params-parse-numbers-differently-neo4j-browser-4-0-3-neo4j-4-0/14920/4

      db.writeCypher('MATCH (u:Rectangle) RETURN u ORDER BY u.width DESC SKIP '+skip_amount+' LIMIT '+limit+'',{})
      .then(data => {

         data.records.forEach(function (record) {
            // TODO: Process data
         });

         res.json({
            "it": "worked",
            "payload": data.records
         });
      }, err => {
         console.dir(err);
         res.json({
            "it" : "failed",
            "reason": err
         });
      })
   });

}
 
module.exports = {
   routes
}