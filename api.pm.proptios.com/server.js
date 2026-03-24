// Neo4j can be found at bolt://graph.jibrisondemand.com:7687
require('dotenv').config()
const http = require('http');
const app = require('./app');
const port = process.env.PORT || 2024;
const server = http.createServer(app);
console.log("API:: proptios.com Service Stated. Running on PORT="+port);
server.listen(port);