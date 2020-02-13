// for the post data
const nodemailer = require('nodemailer');
// for google to work
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
// generic responders
const responders = require('./responders');

// the client id, secret, and redirect url
const oauth2Client = new OAuth2(
  '787700607325-a4oerhmsg9khhk9om26phnuoadkbt45u.apps.googleusercontent.com',
  'YJBVu-WA8rq6XOu5-3n35w-G',
  'https://developers.google.com/oauthplayground',
);
// the refresh_token
oauth2Client.setCredentials({
  refresh_token: '1//04yTcYQgNL4WiCgYIARAAGAQSNwF-L9IriAwwU8v1X2gdhN7xxmNEfTYS3UjQxekfhftEturJXXmP2sVlMij_PJqNnuN5yt6bxTg',
});
const accessToken = oauth2Client.getAccessToken();

const sendEmail = (request, response, postData) => {
  // setting up the from part of our email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'jxh6709@g.rit.edu',
      clientId: oauth2Client._clientId,
      clientSecret: oauth2Client._clientSecret,
      refreshToken: oauth2Client.credentials.refresh_token,
      accessToken,
    },
  });

  // parsing the recipients
  const emails = postData.to.split('|');
  // all of the options conveniently in an object
  const mailOptions = {
    from: 'jxh6709@g.rit.edu',
    to: emails.toString(),
    subject: postData.subject,
    text: postData.content,
  };
  // send it out with the current configuration
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      // something went wrong
      return responders.respondJSONMeta(request, response, 500);
    }
    // email sent
    return responders.respondJSON(request, response, 200, JSON.stringify(info));
  });
};

module.exports = {
  sendEmail,
};
