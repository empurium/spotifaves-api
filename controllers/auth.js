const jwt = require('jsonwebtoken');

/**
 * Callback from Spotify upon successful authentication.
 * Create a JWT and send to the client for future API requests.
 */
exports.getSpotifyCallback = (req, res) => {
  if (typeof req.user !== 'object' || !req.user.tokens) {
    res.redirect(`${process.env.SPOTIFAVES_URL}?login=error`);
    return;
  }

  const payload = {
    sub: req.user.id,
    name: req.user.name,
    spotify_id: req.user.spotify_id,
    photo_url: req.user.photo_url,
    access_token: req.user.tokens.access_token,
    refresh_token: req.user.tokens.refresh_token,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    expiresIn: process.env.JWT_EXPIRES,
  });

  res.redirect(`${process.env.SPOTIFAVES_URL}/#token=${token}`);
};
