const bunyan = require('bunyan');
const { VERBOSITY_LEVELS } = require('./consts/verbosity-levels');

module.exports.create = verbosity => bunyan.createLogger({
    name: 'qc-sprintro',
    level: VERBOSITY_LEVELS[verbosity],
    serializers: bunyan.stdSerializers,
});

module.exports.logRequests = log => (
    (req, res, next) => {
        log.info({
            method: req.method,
            url: req.originalUrl,
        });
        next();
    }
);

module.exports.logToBunyan = log => class {
    constructor() {
        this.error = log.error.bind(log);
        this.warning = log.warn.bind(log);
        this.info = log.info.bind(log);
        this.debug = log.debug.bind(log);
        this.trace = (method, requestUrl, body, responseBody, responseStatus) => {
            log.trace({
                method,
                requestUrl,
                body,
                responseBody,
                responseStatus,
            });
        };
        this.close = () => {};
    }
};
