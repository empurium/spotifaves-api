// require('newrelic');
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const cors = require('cors');
const lusca = require('lusca');
const dotenv = require('dotenv');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');

/**
 * Load environment variables from .env file.
 */
dotenv.load();

/**
 * Connect to DB with Sequelize.
 */
require('./models');

/**
 * Passport authentication configuration.
 */
require('./config/passport');

/**
 * Configure Arena, the bull queue UI.
 */
const arenaConfig = require('./config/bull-arena');

/**
 * Controllers (route handlers).
 */
const authController = require('./controllers/auth');
const apiController = require('./controllers/api');

/**
 * Express!
 */
const app = express();
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.disable('x-powered-by');
app.use(expressStatusMonitor());
app.use(compression());
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

/**
 * Arena, the bull queue UI.
 */
app.use('/', arenaConfig);

/**
 * API routes.
 */
app.get('/', apiController.getIndex);
app.get('/api/artists', passport.authenticate('jwt'), apiController.getArtists);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/spotify', passport.authenticate('spotify', { scope: process.env.SPOTIFY_SCOPES }));
app.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: process.env.SPOTIFAVES_URL }),
  authController.getSpotifyCallback,
);

/**
 * Error Handler to show errors in response. Only for development.
 */
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(
    '%s App is running at http://localhost:%d in %s mode',
    chalk.green('✓'),
    app.get('port'),
    app.get('env'),
  );
  console.log('  Press CTRL-C to stop\n');
});

// Log unhandled exceptions instead of node exiting
process
  .on('unhandledRejection', (err, promise) => {
    console.error(err, 'Unhandled Rejection at Promise', promise);
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown');
  });

module.exports = app;
