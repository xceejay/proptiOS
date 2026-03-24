
// This is a Dummy file ...
const neo4j_db = require('../../../config/db');  // neo4j-db
const PREFIX = "/dummy";

const routes = (app) => {

   // xxxxxxx
   app.post(PREFIX+'/xxxxxx', function(req, res){
      // input vars
      let email = req.body.email;
      let password = req.body.password;

      var db = neo4j_db.get_instance();
      
      db.writeCypher('MATCH (u:User) RETURN *',{})
      
      .then(data => {
        // TODO:
      }, err => {
         // TODO:
      });
   });
}
 
module.exports = {
   routes
}