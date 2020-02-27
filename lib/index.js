const path = require("path");
const _ = require("lodash");
const Email = require("email-templates");

const getStrapiRootDir = () => {
  if (
    path.resolve(__dirname).split("/node_modules")[0] !==
    path.resolve(__dirname)
  ) {
    return path.resolve(__dirname).split("/node_modules")[0];
  } else if (
    path.resolve(__dirname).split("/providers")[0] !== path.resolve(__dirname)
  ) {
    return path.resolve(__dirname).split("/providers")[0];
  }

  return path.resolve(__dirname);
};

module.exports = {
  provider: "email-templates",
  name: "Email Templates",
  auth: {
    nodemailer_default_from: {
      label: "Nodemailer Default From",
      type: "text"
    },
    nodemailer_default_replyto: {
      label: "Nodemailer Default Reply-To",
      type: "text"
    },
    host: {
      label: "Host",
      type: "text"
    },
    port: {
      label: "Port",
      type: "number"
    },
    username: {
      label: "Username",
      type: "text"
    },
    password: {
      label: "Password",
      type: "password"
    },
    secure: {
      label: "Secure",
      type: "enum",
      values: ["True", "False"]
    },
    templatingEngine: {
      label: "Templating Engine",
      type: "enum",
      values: ["EJS"]
    }
  },
  init: config => {
    const email = new Email({
      views: {
        root: path.join(getStrapiRootDir(), "emails"),
        options: {
          extension: "ejs",
          map: {
            ejs: "ejs"
          }
        }
      },
      transport: {
        host: config.host,
        port: config.port,
        secure: config.secure === "True",
        auth: {
          user: config.username,
          pass: config.password
        }
      }
    });

    return {
      send: options => {
        console.log("rootDir", getStrapiRootDir());
        return new Promise((resolve, reject) => {
          options = _.isObject(options) ? options : {};
          options.from = options.from || config.nodemailer_default_from;
          options.replyTo =
            options.replyTo || config.nodemailer_default_replyto;

          if (options.template) {
            email
              .send({
                template: options.template,
                message: {
                  ..._.pick(options, ["from", "to", "cc", "bcc", "attachments"])
                },
                locals: options.locals
              })
              .then(resolve)
              .catch(error => reject(error));
          } else {
            email
              .send({
                message: {
                  ..._.pick(options, [
                    "from",
                    "to",
                    "cc",
                    "bcc",
                    "attachments",
                    "subject",
                    "html",
                    "text"
                  ])
                }
              })
              .then(resolve)
              .catch(error => reject(error));
          }
        });
      }
    };
  }
};
