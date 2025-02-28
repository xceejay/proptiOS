const neo4j_db = require('../../../config/db');  // neo4j-db + OGM

const routes = (app) => {
   app.get('/sample', function(req, res){
      res.json({"sample": "response"});
   });

   app.get('/total', function(req, res){
      var db = neo4j_db.get_instance();
      db.writeCypher('MATCH (n:EarlyAccess) RETURN n',{})
      .then(data => {
        var list_of_items  = [];
        var total = 0;
        for (let index = 0; index < data.records.length; index++) {
            const neo_record = data.records[index];
            let record_props = neo_record._fields;
            list_of_items.push(record_props);
            var intval = parseInt(record_props[0].properties.jibris);
            total += intval;
        }
        res.json({
            "it" : "worked",
            "total_jibris": total,
            "per_hour_pricing": 0.40,
            "revenue_per_hour": "$"+(total * 0.40),
            "profit_hour": "$"+((total * 0.40) - (total * 0.24)).toFixed(2),
            "profit_per_day": "$"+(((total * 0.40) - (total * 0.24)) * 24).toFixed(2),
            "profit_per_week": "$"+(((total * 0.40) - (total * 0.24)).toFixed(2) * 24 * 7).toFixed(2),
            "profit_per_month": "$"+(((total * 0.40) - (total * 0.24)).toFixed(2) * 24 * 7 * 4).toFixed(2),
            "profit_per_year": "$"+(((total * 0.40) - (total * 0.24)).toFixed(2) * 24 * 7 * 4 * 12).toFixed(2),
        });
      }, err => {
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