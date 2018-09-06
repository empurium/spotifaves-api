// require('newrelic');
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
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
const db = require('./models');

/**
 * Set up the Sequelize session store.
 * Create the session table if it doesn't exist with sync().
 */
const sessionStore = new SequelizeStore({ db: db.sequelize });
sessionStore.sync();

/**
 * Controllers (route handlers).
 */
const apiController = require('./controllers/api');

/**
 * Passport authentication configuration.
 */
require('./config/passport');

/**
 * Express!
 */
const app = express();
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.use(expressStatusMonitor());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser());
app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    proxy: true, // for SSL outside of node
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

/**
 * API routes.
 */
app.get('/', apiController.getIndex);
app.get('/api/artists', apiController.getArtists);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: process.env.SPOTIFY_SCOPES,
  }),
);
app.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  (req, res) => res.status(200).json({ message: 'Logged in successfully.' }),
);

/**
 * Error Handler. Only for development, shows
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

module.exports = app;
