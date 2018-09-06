const jwt = require('jsonwebtoken');

/**
 * Callback from Spotify upon successful authentication.
 * Create a JWT and send to the client for future API requests.
 */
exports.getSpotifyCallback = (req, res) => {
  const payload = {
    sub: req.user.id,
    spotify_id: req.user.spotify_id,
    photo_url: req.user.photo_url,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    expiresIn: process.env.JWT_EXPIRES,
  });

  res.redirect(`${process.env.SPOTIFAVE_URL}/#token=${token}`);
};
