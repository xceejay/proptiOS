// Single Item
var db = neo4j_db.get_instance();
db.writeCypher(`QUERY`,{ params })
.then(data => {
     if(data.records.length > 0){
           let neo_record = data.records[0];
           let record_props = neo_record._fields[0].properties;
           let record_labels = neo_record._fields[0].labels;
           res.json({
             "it": "worked",
             "status": null,
             "item": record_props
          });
     }
     else {
       res.json({
          "it": "failed",
          "reason": "not_found"
       });
     }
}, err => {
     res.json({
        "it": "failed",
        "reason": err
     });
});

// Multiple Items
var db = neo4j_db.get_instance();
    var prom2 =  db.writeCypher(`MATCH (n:School) RETURN n`,{})
    .then(data => {
        var list_of_items  = [];
        for (let index = 0; index < data.records.length; index++) {
            const neo_record = data.records[index];
            let record_props = neo_record._fields[0].properties;
            record_props.labels = neo_record._fields[0].labels;
            var record_labels = neo_record._fields[0].labels;
            list_of_items.push(record_props);
            res.json({
                status: "success",
                schools: list_of_items
            });
        }
    }, err => {
        console.log("Error from Sub query ...");
        console.dir(err);
        res.json({
            status: "error",
            err: err,
            schools: list_of_items
        });
    });