const fs = require('fs');
const path = require('path');

// Load the static files once at startup
const index = fs.readFileSync(path.join(__dirname, '../client/index.html'));
const css = fs.readFileSync(path.join(__dirname, '../client/style.css'));

// Send HTML
const getIndex = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': Buffer.byteLength(index),
  });
  res.end(index);
};

// Send CSS
const getCSS = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/css',
    'Content-Length': Buffer.byteLength(css),
  });
  res.end(css);
};

// 404 HTML
const get404 = (req, res) => {
  const message = '<h1>404 - Page Not Found</h1>';
  res.writeHead(404, {
    'Content-Type': 'text/html',
    'Content-Length': Buffer.byteLength(message),
  });
  res.end(message);
};

module.exports = {
  getIndex,
  getCSS,
  get404,
};
