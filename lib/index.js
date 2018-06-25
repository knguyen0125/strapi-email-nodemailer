'use strict';

/**
 * Module dependencies
 */

/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-template */
// Public node modules.
const _ = require('lodash');
const nodemailer = require('nodemailer');

/* eslint-disable no-unused-vars */
module.exports = {
  provider: 'nodemailer',
  name: 'Nodemailer',
  auth: {
    host: {
      label: 'Host',
      type: 'text'
    },
    port: {
      label: 'Port',
      type: 'number'
    },
    secure: {
      label: 'Secure',
      type: 'text'
    },
    username: {
      label: 'Username',
      type: 'text'
    },
    password: {
      label: 'Password',
      type: 'password'
    },
  },
  init: (config) => {

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: true,
      auth: {
        user: config.username,
        pass: config.password,
      },
    });

    return {
      send: (options) => {
        return new Promise((resolve, reject) => {
          // Default values.
          options = _.isObject(options) ? options : {};
          options.from = options.from || config.nodemailer_default_from;
          options.replyTo = options.replyTo || config.nodemailer_default_replyto;
          options.text = options.text || options.html;
          options.html = options.html || options.text;


          let msg = {
            from: options.from,
            to: options.to,
            replyTo: options.replyTo,
            subject: options.subject,
            text: options.text,
            html: options.html
          };

          transporter.sendMail(msg)
            .then(resolve)
            .catch(err => reject([{ messages: [{ id: 'Auth.form.error.email.invalid' }] }]));
        });
      }
    };
  }
};