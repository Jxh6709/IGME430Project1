const { parse } = require('querystring');
const email = require('./emailHandler');
const sheets = require('./sheetsHandler');
const responders = require('./responders');

const getPostData = (request, response, callback) => {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();
  });
  request.on('end', () => callback(parse(body)));
};

const handleEmail = (req, res) => {
  getPostData(req, res, (body) => {
    email.sendEmail(req, res, body);
  });
};

// https://www.w3resource.com/javascript/form/email-validation.php
const validateEmail = (mail) => {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return (true);
  }
  return (false);
};

const addOrUpdateUser = (req, res) => {
  const responseJSON = {
    message: 'Resource Not Found. No, we will not look harder.',
  };

  // get the params so we can validate
  getPostData(req, res, async (body) => {
    if (body.name !== '' && validateEmail(body.email)) {
      // no previous id, we insert
      const scode = await sheets.addOrUpdateRecord(body);
      if (scode === 201) {
        responseJSON.message = `Successfully added ${body.name} to the ${body.listType} contact list`;
        return responders.respondJSON(req, res, 201, JSON.stringify(responseJSON));
      }
      if (scode === 204) {
        return responders.respondJSONMeta(req, res, 204);
      }

      return responders.respondJSON(req, res, 404, JSON.stringify(responseJSON));
    }
    responseJSON.message = 'Bad Request. Invalid Parameters. Nice Try Dan';
    return responders.respondJSON(req, res, 400, JSON.stringify(responseJSON));
  });
};


module.exports = {
  handleEmail,
  addOrUpdateUser,
};
