const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: SpotifyStrategy } = require('passport-spotify');

const models = require('../models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * JWT Strategy for stateless auth middleware.
 * This strategy also handles deserializeUser().
 */
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      issuer: 'spotifaves.com',
      audience: 'spotifaves.com',
    },
    (jwtPayload, done) => {
      models.User.findById(jwtPayload.sub).then((user) => {
        if (!user) {
          return done(true, false);
        }

        return done(null, user.get({ plain: true }));
      });
    },
  ),
);

/**
 * Sign in with Spotify.
 */
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.SPOTIFY_REDIRECT_URI,
    },
    (accessToken, refreshToken, expiresIn, profile, done) => {
      let email = '';
      let photoUrl = '';

      // Pull first email from the array
      if (Array.isArray(profile.emails) && profile.emails.length) {
        email = profile.emails.shift();
        email = email.value;
      }

      // Pull first photo from the array
      if (Array.isArray(profile.photos) && profile.photos.length) {
        photoUrl = profile.photos.shift();
      }

      // Create the user if we don't have this spotify_id
      models.User.findOrCreate({
        where: { spotify_id: profile.id },
        defaults: {
          name: profile.displayName,
          email,
          photo_url: photoUrl,
          spotify_id: profile.id,
          tokens: {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn,
          },
        },
      }).spread((user) => done(false, user.get({ plain: true })));
    },
  ),
);

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({ message: 'Unauthenticated.' });
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const token = req.user.tokens.find((token) => token.access_token !== '');

  if (token) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized.' });
  }
};
