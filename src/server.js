const http = require('http');
const url = require('url');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const postHandler = require('./postResponses');
// grab the appropriate port
const port = process.env.PORT || process.env.NODE_PORT || 3000;
// a wide range of urls that all route to the proper places
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
    '/getUsers': jsonHandler.getUsersMeta,
    '/getTitles': jsonHandler.getTitlesMeta,
    notFound: jsonHandler.notFoundMeta,
  },
  POST: {
    // '/addUser': jsonHandler.updateUser,
    '/sendEmail': postHandler.handleEmail,
    '/addOrUpdateUser': postHandler.addOrUpdateUser,
  },
};

const onRequest = (request, response) => {
  // grab the url
  const parsedUrl = url.parse(request.url);
  // see if we can send it somewhere unless default to not found
  if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};
// the fundamental core of it all 
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
