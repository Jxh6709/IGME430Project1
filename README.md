# IGME430Project1

## What your site does and its purpose?
  
  This site is a simple email client that allows the end user to select from the contacts provided and send an email to them. Contacts can be both created and edited and the contacts can either be personal or business

## What part of your app does the API handle?

  The API handles getting the users from the data store, adding the users to the correct sheet, updating the users in the sheet, and sending an email to all of the requested clients based on the emails sent in.

## What went right and what went wrong?

  Timing was one thing that definitely went right as getting ahead of this allowed me ample time to troubleshoot bugs and connect all the pieces together. The interactive came together quite smoothly and the ship was smooth sailing. However, two areas of wrong were the modal and the credentials. The modal is stored in a Vue JS component and passing data to it in addition to getting data out of it was a massive headache that took a lot of troubleshooting. Also, I had to move the credentials to environment variables on production and those took awhile before they played nice.

## If you were to continue, what would you do to improve your app?
  
Markup : * Move the data from Google Sheets to either PostgresSQL or MongoDB
         * Rebuild the server to use express
         * Add the ability to include attachments
         * Add the ability to import a CSV or XLSX contact list
         * Add a login system so each user can send their own emails
         * Add Email signin so all emails are not sent from my RIT email address

## How did you go above and beyond?

Markup: * Data is stored in Google Sheets as opposed to memory
        * The nodemailer library is used to send emails to users
        * The front end is built with Vue JS
        * A Vue component is used to make the Modal
        * Although it is not reflected in the folder / file strcuture, separation of concerns is implemented to create a MVC-esque code experience
