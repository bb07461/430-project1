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
// pull in our html response handler file
const htmlHandler = require('./htmlResponses.js');
// pull in our json response handler file
const jsonHandler = require('./jsonResponses.js');

