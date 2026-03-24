const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
// var multer = require('multer');
// var upload = multer();
const cors = require('cors');
const app = express();
const middleware = require('./app/middleware/custom');
const api = require('./app/controllers/api');

// secure express app
app.use(helmet({
   dnsPrefetchControl: false,
   frameguard: false,
   ieNoOpen: false,
}));
// parsing the request body
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb'}));
// app.use(bodyParser.json());


// app.use(upload.array());

// allow cross origin requests
app.use(cors({
   origin: '*'
}));

// json body
app.use(express.json());
// custom middlewares
middleware.setHeaders(app); 
// core api code
api.run(app);




module.exports = app;