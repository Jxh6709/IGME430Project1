// for the post data
const url = require('url');
const responders = require('./responders');
const sheets = require('./sheetsHandler');
// whoever triggered this gets an e for effort
const notFound = (request, response) => {
  const responseJSON = {
    message: 'What you seek is not here',
    id: 'notFound',
  };
  return responders.respondJSON(request, response, 404, responseJSON);
};

/**
 * An asyncronous function to get the users out of Google Sheets
 * Depending on the list type, we ask for the users of a different list
 */
const getUsers = async (request, response) => {
  // grab the query params
  const potentialQueryParams = url.parse(request.url, true).query;

  // if they get the list type right, we patiently grab the appropriate sheet and return the contents
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
/**
 * Similar to getUsers, we ask for the titles and await a reply
 */
const getTitles = async (request, response) => {
  const titles = await sheets.getSheetTitles();
  if (titles) {
    return responders.respondJSON(request, response, 200, titles);
  }
  // no titles for you
  return notFound;
};
// for the head requests, sneding back the status codes
const getUsersMeta = (request, response) => responders.respondJSONMeta(request, response, 200);

const getTitlesMeta = (request, response) => responders.respondJSONMeta(request, response, 200);

const notFoundMeta = (request, response) => responders.respondJSONMeta(request, response, 404);

module.exports = {
  getUsers,
  getUsersMeta,
  getTitles,
  getTitlesMeta,
  notFound,
  notFoundMeta,
};
