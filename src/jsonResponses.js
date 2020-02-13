// for the post data
const url = require('url');
const responders = require('./responders');
const sheets = require('./sheetsHandler');

const notFound = (request, response) => {
  const responseJSON = {
    message: 'What you seek is not here',
    id: 'notFound',
  };
  return responders.respondJSON(request, response, 404, responseJSON);
};


const getUsers = async (request, response) => {
  const potentialQueryParams = url.parse(request.url, true).query;

  if (potentialQueryParams.contactListType === 'Personal') {
    const contacts = await sheets.getContacts(0);
    return responders.respondJSON(request, response, 200, contacts);
  }
  if (potentialQueryParams.contactListType === 'Business') {
    const contacts = await sheets.getContacts(1);
    return responders.respondJSON(request, response, 200, contacts);
  }
  return notFound;
};

const getTitles = async (request, response) => {
  const titles = await sheets.getSheetTitles();
  return responders.respondJSON(request, response, 200, titles);
};

const getUsersMeta = (request, response) => responders.respondJSONMeta(request, response, 200);

const notFoundMeta = (request, response) => responders.respondJSONMeta(request, response, 404);

module.exports = {
  getUsers,
  getUsersMeta,
  getTitles,
  notFound,
  notFoundMeta,
};
