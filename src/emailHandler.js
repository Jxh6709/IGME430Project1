// for the post data
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const { OAuth2 } = google.auth;
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

  const mailOptions = {
    from: 'jxh6709@g.rit.edu',
    to: emails.toString(),
    subject: postData.subject,
    text: postData.content,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return responders.respondJSONMeta(request, response, 500);
      // return false;
    }
    return responders.respondJSON(request, response, 200, JSON.stringify(info));
    // return info;
  });
};

module.exports = {
  sendEmail,
};
