const path = require('path');
const argv = require('./cli')(process.argv);
const logger = require('./log').create(argv.verbose || 0);
const app = require('./app')(logger);
const elasticsearch = require('./elasticsearch');
const router = require('./router');

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// Answer API requests.
// app.get('/api', function (req, res) {
//   res.set('Content-Type', 'application/json');
//   res.send('{"message":"Hello from the custom server!"}');
// });

router(app, logger, elasticsearch);
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), () => {
    logger.info({ port: app.get('port') }, 'Listening ');
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});
