const { parse } = require('querystring');
const email = require('./emailHandler');
const sheets = require('./sheetsHandler');
const responders = require('./responders');
// a wonderful little function equipped with a callback that gives us all the bosy params as an object
const getPostData = (request, response, callback) => {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();
  });
  request.on('end', () => callback(parse(body)));
};
/**
 * A happy middleman for our emails that gets the params and sends them to the sheets handler
 */
const handleEmail = (req, res) => {
  getPostData(req, res, (body) => {
    email.sendEmail(req, res, body);
  });
};

// https://www.w3resource.com/javascript/form/email-validation.php
/**
 * Takes an email address and verifies that it is valid
 */
const validateEmail = (mail) => {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return (true);
  }
  return (false);
};

const addOrUpdateUser = (req, res) => {
  // default response of not here buddy
  const responseJSON = {
    message: 'Internal Server Error. Please try again later',
  };

  // get the params so we can validate
  getPostData(req, res, async (body) => {
    if (body.name !== '' && validateEmail(body.email)) {
      // grab the status code of the attempt
      const scode = await sheets.addOrUpdateRecord(body);
      if (scode === 201) {
        // we inserted
        responseJSON.message = `Successfully added ${body.name} to the ${body.listType} contact list`;
        return responders.respondJSON(req, res, 201, JSON.stringify(responseJSON));
      }
      if (scode === 204) {
        // we updated
        return responders.respondJSONMeta(req, res, 204);
      }
      // something went wrong
      return responders.respondJSON(req, res, 500, JSON.stringify(responseJSON));
    }
    // didn't pass validation and return so the parameters must be bad 
    responseJSON.message = 'Bad Request. Invalid Parameters. Nice Try Dan';
    return responders.respondJSON(req, res, 400, JSON.stringify(responseJSON));
  });
};


module.exports = {
  handleEmail,
  addOrUpdateUser,
};
