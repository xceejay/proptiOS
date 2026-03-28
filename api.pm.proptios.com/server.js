// Neo4j can be found at bolt://graph.jibrisondemand.com:7687
require('dotenv').config()
const http = require('http');
const app = require('./app');
const port = process.env.PORT || 2024;
const server = http.createServer(app);
server.timeout = 30000; // 30s — kill requests that hang longer than this
server.keepAliveTimeout = 65000; // slightly above typical LB idle timeout (60s)
console.log("API:: proptios.com Service Stated. Running on PORT="+port);
server.listen(port);