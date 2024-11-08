const express = require('express');
const morgan = require("morgan");
require('dotenv').config();

// might use this future if  need middleware modification
// const { createProxyMiddleware } = require('http-proxy-middleware');
var proxy = require('express-http-proxy');


// Create Express Server
const app = express();

const args = process.argv.slice(2); // Skips the first two arguments (node and script name)
const sessionArg = args.find(arg => arg.startsWith('session='));
// console.log('Session ID:', sessionArg);



// Configuration

// Logging
app.use(morgan('dev'));
app.use('/', proxy(process.env.API_SERVICE_URL, {
    https: true,
    preserveHostHdr: false,
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        // set headers
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['Cookie'] = sessionArg //process.env.SESSION_COOKIE;

        // change the method if needed
        // proxyReqOpts.method = 'GET';
        return proxyReqOpts;
      }
}));

// Start the Proxy
app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Starting Proxy at ${process.env.HOST}:${process.env.PORT}`);
    console.log(`Current Cookie ${sessionArg}`);
 });
  