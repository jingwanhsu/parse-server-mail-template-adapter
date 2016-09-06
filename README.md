# parse-server-mail-template-adapter
Adapter for customizing email template of parse-server

## Installation

Install from npm:
    
    npm install parse-server-mail-template-adapter --save
    

## Configuration
    var ParseServer = require('parse-server').ParseServer;
    var SimpleSendGridAdapter = require('parse-server-sendgrid-adapter');
    var MailTemplateAdapter = require('parse-server-mail-template-adapter');

    var api = new ParseServer({
      // ... Other necessary parameters ...
      appName: 'myAppName',
      publicServerURL: 'http://localhost:1337/parse', // Don't forget to change to https if needed
      emailAdapter: MailTemplateAdapter({
        // Take SimpleSendGridAdapter for example, you can use any other adapter instead
        adapter: SimpleSendGridAdapter({
          apiKey: 'sendgridApiKey',
          fromAddress: 'fromEmailAddress',
        }),
        template: {
          verification: {
            subject: "verification subject",
            // Choose one in body and bodyFile, if both setted then body used
            body: "verfication body", 
            bodyFile: "./VerificationEmailBody.txt",
          },
          resetPassword: {  // Same as verification
            subject: "reset password subject",
            body: "reset password body",
            bodyFile: "./mail/ResetPasswordEmail.txt",
          }
        }
      })
    });

There are some variables can be used in subject and body:

- `%username%`: the user's display name
- `%email%`: the user's email address
- `%appname%`: your application's display name
- `%link%`: the link the user must click to perform the requested action