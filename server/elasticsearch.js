const elasticsearch = require('elasticsearch');
const bob = require('elastic-builder/src');
const log = require('./log');
const {
    successfullyReceivedStoreData,
    errorReceivingStoreData,
    connectedToElasticsearch,
} = require('./consts/logMessages');

// Import .env if applicable
require('dotenv').config();

let esClient;
let rootLogger;

const constants = {
    BONSAI_URL_ENV: 'BONSAI_URL',
    ES_ALIAS: 'call-for-price-icp-bulkloader-current',
    TYPE: {
        CURRENT_CALL_FOR_PRICE_BRANCH: 'currentCallForPriceBranch',
    },
    REQUEST_TIMEOUT: 30000,
    HITS_MAX: 10000,
};

/*
TODO: Devise a way to test the inputs to the service to ensure valid handling.
*/

module.exports.connect = async (logger) => {
    rootLogger = logger;
    esClient = new elasticsearch.Client({
        host: process.env[constants.ELASTICSEARCH_URI_ENV],
        log: log.logToBunyan(rootLogger),
    });

    try {
        await esClient.ping({
            requestTimeout: constants.REQUEST_TIMEOUT,
        });
        rootLogger.info(connectedToElasticsearch);
    } catch (err) {
        rootLogger.error({ err }, 'Error connection to elasticsearch');
        throw err;
    }
};

module.exports.callForPriceAvailable = async (logger, storeId) => {
    try {
        const esQuery = bob.requestBodySearch()
            .query(bob.boolQuery()
                .filter(bob.termQuery('storeId', storeId)))
            .size(0)
            .toJSON();

        logger.info({ 'ElasticSearch Request Body': esQuery });

        const { hits } = await esClient.search({
            index: constants.ES_ALIAS,
            type: constants.TYPE.CURRENT_CALL_FOR_PRICE_BRANCH,
            body: esQuery,
        });

        logger.info(hits.total > 0, `Store ${storeId} valid`);
        return (hits.total > 0);
    } catch (err) {
        logger.error({ err }, errorReceivingStoreData);
        throw err;
    }
};

module.exports.getStoreData = async (logger, storeId, queryAdd) => {
    try {
        let esQuery = queryAdd || bob.requestBodySearch();
        esQuery = esQuery
            .query(bob.boolQuery()
                .filter(bob.termQuery('storeId', storeId)))
            .size(constants.HITS_MAX)
            .toJSON();

        logger.info({ 'ElasticSearch Request Body': esQuery });

        const { hits } = await esClient.search({
            index: constants.ES_ALIAS,
            type: constants.TYPE.CURRENT_CALL_FOR_PRICE_BRANCH,
            body: esQuery,
        });

        logger.info({ hitTotal: hits.total }, successfullyReceivedStoreData);
        if (hits.total > 0) {
            // eslint-disable-next-line no-underscore-dangle
            return hits.hits.map(h => h._source);
        }

        return [];
    } catch (err) {
        logger.error({ err }, errorReceivingStoreData);
        throw err;
    }
};

module.exports.getProducts = async (logger, storeId) => {
    const esQuery = bob.requestBodySearch()
        .source(['departmentId', 'category', 'productCategoryId', 'subProductCategoryId', 'productId', 'productName', 'vendorName']);
    return this.getStoreData(logger, storeId, esQuery);
};

module.exports.getDepartments = async (logger, storeId) => {
    const esQuery = bob.requestBodySearch()
        .source('department*');

    return this.getStoreData(logger, storeId, esQuery);
};

module.exports.getVendors = async (logger, storeId) => {
    const esQuery = bob.requestBodySearch()
        .source(['vendorName', 'category', 'department*', 'productCategoryId', 'subProductCategoryId']);

    return this.getStoreData(logger, storeId, esQuery);
};