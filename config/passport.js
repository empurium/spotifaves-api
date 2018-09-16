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
    (jwtPayload, done) => done(null, { id: jwtPayload.sub, ...jwtPayload }),
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
      // Pull first email from the array
      let email = '';
      if (Array.isArray(profile.emails) && profile.emails.length) {
        email = profile.emails.shift();
        email = email.value;
      }

      // Pull first photo from the array
      let photoUrl = '';
      if (Array.isArray(profile.photos) && profile.photos.length) {
        photoUrl = profile.photos.shift();
      }

      // Our user
      const userData = {
        email,
        name: profile.displayName,
        photo_url: photoUrl,
        spotify_id: profile.id,
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: expiresIn,
        },
      };

      // Create the user if we don't have this spotify_id
      models.User.findOrCreate({ where: { spotify_id: profile.id }, defaults: userData })
        .spread((user, created) => {
          if (created) {
            done(false, user.get({ plain: true }));
            return;
          }

          // Update the tokens and other data for the existing user
          return user
            .update(userData)
            .then((user) => done(false, user.get({ plain: true })))
            .catch(() => done(false, { id: 0 }));
        })
        .catch(() => done(false, { id: 0 }));
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
