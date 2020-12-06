// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const _data = require('./lib/data');

_data.delete('test', 'newFile', (err) => {
  console.log('error:', err);
});

// Instantiate the HTTP server
const httpServer = http.createServer(unifiedServer);

// Start the server
const httpPort = config.httpPort;
httpServer.listen(httpPort, () => {
  console.log(`HTTP Server is listening on port ${httpPort} [${config.envName}]`);
});

// Instantiate the HTTPS server
const httpsOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
};
const httpsServer = https.createServer(httpsOptions, unifiedServer);

// Start the server
const httpsPort = config.httpsPort;
httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS Server is listening on port ${httpsPort} [${config.envName}]`);
});

function unifiedServer(req, res) {
  // get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // get the query string as an object
  const queryStringObject = parsedUrl.query;

  // get the HTTP method
  const method = req.method.toLowerCase();

  // get the headers as an object
  const headers = req.headers;

  // get the payload, if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();

    // log the request
    console.log(`request received on path: ${trimmedPath}
  with method: ${method}
  and with these query string parameters: ${JSON.stringify(queryStringObject)}
  and these headers: ${JSON.stringify(headers)}
  and this payload: ${buffer}`);

    // choose the handler this request should go to
    const chosenHandler = router[trimmedPath] || handlers.notFound;

    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer,
    };

    // route the request
    chosenHandler(data, (statusCode = 200, payload = {}) => {

      // convert payload
      const payloadString = JSON.stringify(payload);

      // return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // log response
      console.log(`responded with statusCode: ${statusCode} and payload: ${payloadString}`)
    });

  });
}

// define the handlers
const handlers = {};

// ping handler
handlers.ping = (data, callback) => {
  callback(200);
};

// sample handler
handlers.notFound = (data, callback) => {
  callback(404);
};

// define a request router
const router = {
  ping: handlers.ping,
};