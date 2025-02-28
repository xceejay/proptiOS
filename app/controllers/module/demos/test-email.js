var postmark = require("postmark");
const client = new postmark.Client("95885ca1-2535-4cda-82ff-ca58c6091e3c"); // postmark email service

const routes = (app) => {
   app.get('/test-email', function(req, res){
      console.log("Sending test email to dominic@expertlyglobal.com");
      client.sendEmail({
        "From": "hello@expertlyglobal.com",
        "To": "hello@dominicdamoah.com,dominic.imakestuff@gmail.com,dominic@tsinvestmentgroup.com,david@tsinvestmentgroup.com",
        "Subject": "Test Email",
        "TextBody": "Hello from Postmark! Its Alive!"
      }).then(function(){
        console.log("It has been sent. Kindly wait for delivery status");
        res.json({
          "status" : "delivered",
        });
      }, function(err){
        res.json({
          "status" : "errored",
        });
      });
    });
}
 
module.exports = {
   routes
}