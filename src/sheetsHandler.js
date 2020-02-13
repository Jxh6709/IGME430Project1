const { GoogleSpreadsheet } = require('google-spreadsheet');
// json for dev testing only
// const creds = require('../igme430email-80788da58914.json');
// spreadsheet key is the long id in the sheets URL
const doc = new GoogleSpreadsheet('1FP1MPjPiFGxoGEmQ2AxL2Dc2ChiZ6utwQl3NkYHzsZo');

// connects to google sheets and retrieves the contact data
const getContacts = async (titleIndex) => {
  // clear the contacts;
  const contacts = [];
  // authenticating and loading the document
  // await doc.useServiceAccountAuth(creds);
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });
  await doc.loadInfo(); // loads document properties and worksheets

  // press 0 for personal, 1 for business
  if (titleIndex === 0 || titleIndex === 1) {
    const sheet = await doc.sheetsByIndex[titleIndex];
    const rows = await sheet.getRows();
    // loop through the rows to get the Data
    if (sheet.rowCount > 0) {
      rows.forEach((element) => {
        contacts.push({
          id: element.id,
          name: element.name,
          email: element.email,
        });
      });
      return contacts;
    }
  }
  // not found
  return false;
};

const getSheetTitles = async () => {
  // authenticating and loading the document
  // await doc.useServiceAccountAuth(creds);
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });
  await doc.loadInfo(); // loads document properties and worksheets

  const titles = [];
  const { sheetCount } = doc;

  if (sheetCount === 0) {
    return false;
  }

  for (let i = 0; i < sheetCount; i++) {
    const sheet = doc.sheetsByIndex[i];
    titles.push({
      index: i,
      title: sheet.title,
    });
  }
  return titles;
};

const addOrUpdateRecord = async (person) => {
  // authenticating and loading the document
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });
  // await doc.useServiceAccountAuth(creds);
  await doc.loadInfo(); // loads document properties and worksheets
  // get the appropriate sheet
  const sheet = (person.listType === 'Personal') ? doc.sheetsByIndex[0] : doc.sheetsByIndex[1];
  // assuming all the validation has passed, we add the row
  // need to get the id
  const rows = await sheet.getRows();


  if (person.id === 'null') {
    // no id so we know to insert
    let insertId = 0;
    rows.forEach((element) => {
      insertId = element.id;
    });
    // increment the id
    insertId++;
    await sheet.addRow({ id: insertId, name: person.name, email: person.email });
    return insertId;
  }
  if (rows[person.id]) {
    // we have a record, updating
    rows[person.id].name = person.name;
    rows[person.id].email = person.email;
    await rows[person.id].save();
    return 204;
  }
  // guess nothing to see here
  return 404;
};


module.exports = {
  getContacts,
  getSheetTitles,
  addOrUpdateRecord,
};
