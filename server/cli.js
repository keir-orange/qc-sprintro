const yargs = require('yargs');

module.exports = argv => yargs
    .options('verbose', {
        alias: 'v',
        describe: 'Increase logging verbosity',
        count: true,
    })
    .parse(argv);
