const bodyParser = require('body-parser');
const express = require('express');
const log = require('./log');

module.exports = (logger) => {
    const app = express();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(log.logRequests(logger));
    return app;
};
