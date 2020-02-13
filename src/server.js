const http = require('http');
const url = require('url');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const postHandler = require('./postResponses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/css/style.css': htmlHandler.getCSS,
    '/js/index.js': htmlHandler.getJS,
    '/js/component.js': htmlHandler.getJSComponents,
    '/getUsers': jsonHandler.getUsers,
    '/getTitles': jsonHandler.getTitles,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    // '/getUsers': jsonHandler.getUsersMeta,
    notFound: jsonHandler.notFoundMeta,
  },
  POST: {
    // '/addUser': jsonHandler.updateUser,
    '/sendEmail': postHandler.handleEmail,
    '/addOrUpdateUser': postHandler.addOrUpdateUser,
  },
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
