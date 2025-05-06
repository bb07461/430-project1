/**
 * Data from .json files must be loaded into memory and parsed at server startup.
All future access to data should be from the resulting JavaScript object.
● Must use all of the following status codes in the appropriate places:
○ 200, 201, 204, 400, 404
○ Additional status codes should be used if/where applicable
● Must have at least 4 GET endpoints to retrieve different data, along with support
for HEAD requests to those same endpoints.
● At least one GET endpoint must support query parameters for filtering/limiting the
data returned by the API. If query parameters are applicable for more than one
endpoint, they should also be used there.
○ Data filtering should be done by the API, not by the client webpage.
● Must have at least 2 POST endpoints for adding and editing data.
○ POST request endpoints should accept incoming body data in both JSON
and x-www-form-urlencoded formats, and parse them based on the
Content-Type of the POST request.
○ Note that GET/HEAD requests should never add, modify, or remove data
from the server.
○ Be aware that we have not covered data persistence, which means data
added to your API will disappear when the server restarts (every 30
minutes on Heroku). You are not required to persist data permanently, but
it should stick around between requests until the server restarts.
● Endpoints must have proper error handling for invalid / bad requests, etc.
● Must return a 404 response if the user goes to a non-existent endpoint.
● Must set the following response headers for all responses:
○ Content-Type
○ Content-Length
● All data endpoints must support and default to JSON responses. Support for
other response types is optional, but should be controlled by the Accept header.
● Any static files needed for the client facing website (HTML, CSS, Client JS,
images, videos, etc) must be served by your server
 */

const http = require('http'); // pull in the http server module
const url = require('url');
const query = require('querystring');
const fs = require('fs');
const path = require('path');
// pull in our html response handler file
const htmlHandler = require('./htmlResponses.js');

// pull in our json response handler file
const jsonHandler = require('./jsonResponses.js');

const countriesRaw = fs.readFileSync(path.join(__dirname, 'data/countries.json'));
const countriesData = JSON.parse(countriesRaw);

const port = process.env.PORT || 3000;

// Set common headers
const setHeaders = (res, contentType, content) => {
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', Buffer.byteLength(content));
};

const onRequest = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query: queryParams } = parsedUrl;

  // HEAD & GET requests
  if (req.method === 'GET' || req.method === 'HEAD') {
    switch (pathname) {
      case '/':
        return htmlHandler.getIndex(req, res, req.method === 'HEAD');

      case '/style.css':
        return htmlHandler.getCSS(req, res, req.method === 'HEAD');

      case '/api/countries':
        return jsonHandler.getAllCountries(req, res, countriesData, queryParams, req.method === 'HEAD');

      case '/api/countries/region':
        return jsonHandler.getCountriesByRegion(req, res, countriesData, queryParams, req.method === 'HEAD');

      case '/api/countries/code':
        return jsonHandler.getCountryByCode(req, res, countriesData, queryParams, req.method === 'HEAD');

      case '/api/countries/nationality':
        return jsonHandler.getByNationality(req, res, countriesData, queryParams, req.method === 'HEAD');

      default:
        return jsonHandler.notFound(req, res, req.method === 'HEAD');
    }
  }

  // POST requests
  if (req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      const contentType = req.headers['content-type'];
      let parsedBody = {};

      if (contentType === 'application/json') {
        try {
          parsedBody = JSON.parse(body);
        } catch (e) {
          return jsonHandler.badRequest(res, 'Invalid JSON');
        }
      } else if (contentType === 'application/x-www-form-urlencoded') {
        parsedBody = query.parse(body);
      } else {
        return jsonHandler.badRequest(res, 'Unsupported Content-Type');
      }

      if (pathname === '/api/countries/add') {
        return jsonHandler.addCountry(req, res, countriesData, parsedBody);
      }

      if (pathname === '/api/countries/edit') {
        return jsonHandler.editCountry(req, res, countriesData, parsedBody);
      }

      return jsonHandler.notFound(req, res);
    });
  }

  // fallback
  return jsonHandler.notFound(req, res);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Server running on port ${port}`);
});