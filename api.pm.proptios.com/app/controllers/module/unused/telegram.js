const axios = require("axios");
const bodyParser = require("body-parser");
const BOT_ID = "1377652555:AAHFsxintGRkUYuRP8XXVwIcdBDpoWRMWB8";
const JOD_GROUP_MAIN = "-465992311,";

const routes = (app) => {
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  app.use(bodyParser.json());

  app.post("/sendtotelegram", function (req, res) {
    batchid = req.body.batchid;
    failurecount = req.body.failurecount;
    successcount = req.body.successcount;
    expectedcount = req.body.expectedcount;

    let message = `BATCH ID: ${batchid}\nNUMBER OF SUCCEEDED RECORDERS: ${successcount}\nNUMBER OF FAILED RECORDERS: ${failurecount}\nNUMBER OF EXPECTED RECORDERS: ${expectedcount}`;

    let URL = `https://api.telegram.org/bot${BOT_ID}/sendMessage?chat_id=${JOD_GROUP_MAIN}&text=${message}`;

    axios.get(URL).then(
      (data) => {
        res.json({
          status: "success",
        });
      },
      function (err) {
        console.log(err);
        res.json({
          status: "fail",
          err: err,
        });
      }
    );
  });
};

module.exports = {
  routes,
};
