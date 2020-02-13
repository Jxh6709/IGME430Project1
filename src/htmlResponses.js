const fs = require('fs'); // pull in the file system module
// the four files we'll need to serve 
const index = fs.readFileSync(`${__dirname}/../index.html`);
const css = fs.readFileSync(`${__dirname}/../css/style.css`);
const js = fs.readFileSync(`${__dirname}/../js/index.js`);
const components = fs.readFileSync(`${__dirname}/../js/component.js`);
// same code for all four, sending back the foles people requested
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getJSComponents = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/js' });
  response.write(components);
  response.end();
};

const getJS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/js' });
  response.write(js);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  getJS,
  getJSComponents,
};
