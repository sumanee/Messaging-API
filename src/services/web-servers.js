const express = require('express');
const http = require('http');

const bodyParser = require('body-parser');
const config = require('../../config.json');
const { webhook } = require('../routes/webhook');
let httpServer;

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    const app = express();
    httpServer = http.createServer(app);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    webhook(app);
    app
      .listen(config.port)
      .on('listening', () => {
        console.log(`http Web server listening on localhost:${config.port}`);
        resolve();
      })
      .on('error', err => {
        reject(err);
      });
  });
};
module.exports.close = () => {
  return new Promise((resolve, reject) => {
    httpServer.close(err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};
