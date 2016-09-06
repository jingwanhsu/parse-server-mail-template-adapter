import fs from 'fs';

let replacePlaceHolder = (text, options) => {
  return text.replace(/%email%/g, options.user.get("email"))
            .replace(/%appname%/g, options.appName)
            .replace(/%link%/g, options.link);
}


let MailTemplateAdapter = mailOptions => {
  if (!mailOptions || !mailOptions.adapter) {
    throw 'MailTemplateAdapter requires an adapter.';
  }
  var adapter = mailOptions.adapter;

  if (!mailOptions.template) {
    return adapter;
  }

  var customeized = {}


  if (mailOptions.template.verification) {
    var verification = mailOptions.template.verification;

    if (!verification.subject) {
      throw 'MailTemplateAdapter verification requires subject.';
    }
    var verificationSubject = verification.subject;
    var verificationText = "";

    if (verification.body) {
      verificationText = verification.body;
    }
    else if (verification.bodyFile) {
      verificationText = fs.readFileSync(verification.bodyFile, "utf8");        
    }
    else {
      throw 'MailTemplateAdapter verification requires body.';
    }

    customeized.sendVerificationEmail = function(options) {
      return new Promise((resolve, reject) => {

        var to = options.user.get("email");
        var text = replacePlaceHolder(verificationText, options);
        var subject = replacePlaceHolder(verificationSubject, options);

        this.sendMail({ text: text, to: to, subject: subject }).then(json => {
          resolve(json);
        }, err => {
          reject(err);
        });
      });
    };
  }

  if (mailOptions.template.resetPassword) {
    var resetPassword = mailOptions.template.resetPassword;

    if (!resetPassword.subject) {
      throw 'MailTemplateAdapter resetPassword requires subject.';
    }
    var resetPasswordSubject = resetPassword.subject;
    var resetPasswordText = "";

    if (resetPassword.body) {
      resetPasswordText = resetPassword.body;
    }
    else if (resetPassword.bodyFile) {
      resetPasswordText = fs.readFileSync(resetPassword.bodyFile, "utf8");        
    }
    else {
      throw 'MailTemplateAdapter resetPassword requires body.';
    }

    customeized.sendPasswordResetEmail = function(options) {
      return new Promise((resolve, reject) => {

        var to = options.user.get("email");
        var text = replacePlaceHolder(resetPasswordText, options);
        var subject = replacePlaceHolder(resetPasswordSubject, options);

        this.sendMail({ text: text, to: to, subject: subject }).then(json => {
          resolve(json);
        }, err => {
          reject(err);
        });
      });
    };
  }


  return Object.freeze(Object.assign(customeized, adapter));
}

module.exports = MailTemplateAdapter