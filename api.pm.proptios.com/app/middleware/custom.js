const cookieParser = require('cookie-parser');

// sets headers and permissions for all requests.
const setHeaders = app => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // * to allow access to all servers
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Resquested-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods', 'POST,GET,PUT'); // header to allow only POST and GET requests
      return res.status(200).json({});
    }
    next();
  });
}


module.exports = {
  setHeaders
}