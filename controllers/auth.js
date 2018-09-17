const jwt = require('jsonwebtoken');
const models = require('../models');
const spotifyHelper = require('../utils/spotify');

const authController = {};

/**
 * Callback from Spotify upon successful authentication.
 * Create a JWT and send to the client for future API requests.
 */
authController.getSpotifyCallback = (req, res) => {
  if (typeof req.user !== 'object' || !req.user.access_token) {
    res.redirect(`${process.env.SPOTIFAVES_URL}?login=error`);
    return;
  }

  const payload = {
    sub: req.user.id,
    name: req.user.name,
    spotify_id: req.user.spotify_id,
    photo_url: req.user.photo_url,
    access_token: req.user.access_token,
    refresh_token: req.user.refresh_token,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    expiresIn: process.env.JWT_EXPIRES,
  });

  res.redirect(`${process.env.SPOTIFAVES_URL}/#token=${token}`);
};

/**
 * Use the refresh_token to get an updated access_token for the
 * currently authenticated user.
 */
authController.getNewAccessToken = async (req, res) => {
  const token = await spotifyHelper.getNewAccessToken(req.user.refresh_token);

  if (!token || typeof token !== 'object' || !token.access_token) {
    res.status(401).json({ message: 'Unable to retrieve access token.', token });
    return;
  }

  models.User.findById(req.user.sub).then((user) =>
    user
      .update({
        access_token: token.access_token,
        token_expires: spotifyHelper.getTokenExpiration(token.expires_in),
      })
      .then(() => res.send({ access_token: token.access_token }))
      .catch((err) => {
        console.error(err);
        res.status(401).json({ message: 'Unable to retrieve access token.' });
      }),
  );
};

module.exports = authController;
