const got = require('got');

const spotifyHelper = {};

/**
 * Generate Spotify's preferred base64 Basic auth string.
 */
spotifyHelper.getSpotifyBasicAuth = () =>
  Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString(
    'base64',
  );

/**
 * Generate a timestamp for when the token will expire.
 * Subtracts 2 minutes to prevent expired requests going out.
 */
spotifyHelper.getTokenExpiration = (expiresIn) =>
  Math.floor(Date.now() / 1000) + parseInt(expiresIn, 10) - 120;

/**
 * Use a refresh token to get a new access token from Spotify.
 */
spotifyHelper.getNewAccessToken = async (refreshToken) => {
  const spotifyUrl = 'https://accounts.spotify.com/api/token';
  const basicAuth = spotifyHelper.getSpotifyBasicAuth();

  const reqOptions = {
    headers: { Authorization: `Basic ${basicAuth}` },
    body: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
    json: true,
    form: true,
    // useElectronNet: bool
  };

  let response;
  try {
    response = await got.post(spotifyUrl, reqOptions);
  } catch (err) {
    console.error(err);
    return false;
  }

  return typeof response.body === 'object' && response.body.access_token !== ''
    ? response.body
    : false;
};

module.exports = spotifyHelper;
