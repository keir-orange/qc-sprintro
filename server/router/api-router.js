const express = require('express');
const { rootPath } = require('../consts/routePaths');

module.exports = (app) => {
    // add an anonymous session/authentication check here

    const apiRouter = express.Router({ mergeParams: true });
    app.use(`${rootPath}/:sprintRetroId`, apiRouter);
    return apiRouter;
};
