const graph = require('fbgraph');
const { LastFmNode } = require('lastfm');
const stripe = require('stripe')(process.env.STRIPE_SKEY);
const clockwork = require('clockwork')({ key: process.env.CLOCKWORK_KEY });

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (req, res) => {
  res.render('api/index', {
    title: 'API Examples',
  });
};

/**
 * GET /api/facebook
 * Facebook API example.
 */
exports.getFacebook = (req, res, next) => {
  const token = req.user.tokens.find((token) => token.kind === 'facebook');
  graph.setAccessToken(token.accessToken);
  graph.get(
    `${req.user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`,
    (err, profile) => {
      if (err) {
        return next(err);
      }
      res.render('api/facebook', {
        title: 'Facebook API',
        profile,
      });
    },
  );
};

/**
 * GET /api/lastfm
 * Last.fm API example.
 */
exports.getLastfm = async (req, res, next) => {
  const lastfm = new LastFmNode({
    api_key: process.env.LASTFM_KEY,
    secret: process.env.LASTFM_SECRET,
  });
  const getArtistInfo = () =>
    new Promise((resolve, reject) => {
      lastfm.request('artist.getInfo', {
        artist: 'Roniit',
        handlers: {
          success: resolve,
          error: reject,
        },
      });
    });
  const getArtistTopTracks = () =>
    new Promise((resolve, reject) => {
      lastfm.request('artist.getTopTracks', {
        artist: 'Roniit',
        handlers: {
          success: ({ toptracks }) => {
            resolve(toptracks.track.slice(0, 10));
          },
          error: reject,
        },
      });
    });
  const getArtistTopAlbums = () =>
    new Promise((resolve, reject) => {
      lastfm.request('artist.getTopAlbums', {
        artist: 'Roniit',
        handlers: {
          success: ({ topalbums }) => {
            resolve(topalbums.album.slice(0, 3));
          },
          error: reject,
        },
      });
    });
  try {
    const { artist: artistInfo } = await getArtistInfo();
    const topTracks = await getArtistTopTracks();
    const topAlbums = await getArtistTopAlbums();
    const artist = {
      name: artistInfo.name,
      image: artistInfo.image ? artistInfo.image.slice(-1)[0]['#text'] : null,
      tags: artistInfo.tags ? artistInfo.tags.tag : [],
      bio: artistInfo.bio ? artistInfo.bio.summary : '',
      stats: artistInfo.stats,
      similar: artistInfo.similar ? artistInfo.similar.artist : [],
      topTracks,
      topAlbums,
    };
    res.render('api/lastfm', {
      title: 'Last.fm API',
      artist,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/stripe
 * Stripe API example.
 */
exports.getStripe = (req, res) => {
  res.render('api/stripe', {
    title: 'Stripe API',
    publishableKey: process.env.STRIPE_PKEY,
  });
};

/**
 * POST /api/stripe
 * Make a payment.
 */
exports.postStripe = (req, res) => {
  const { stripeToken, stripeEmail } = req.body;
  stripe.charges.create(
    {
      amount: 395,
      currency: 'usd',
      source: stripeToken,
      description: stripeEmail,
    },
    (err) => {
      if (err && err.type === 'StripeCardError') {
        req.flash('errors', { msg: 'Your card has been declined.' });
        return res.redirect('/api/stripe');
      }
      req.flash('success', { msg: 'Your card has been successfully charged.' });
      res.redirect('/api/stripe');
    },
  );
};

/**
 * GET /api/clockwork
 * Clockwork SMS API example.
 */
exports.getClockwork = (req, res) => {
  res.render('api/clockwork', {
    title: 'Clockwork SMS API',
  });
};

/**
 * POST /api/clockwork
 * Send a text message using Clockwork SMS
 */
exports.postClockwork = (req, res, next) => {
  const message = {
    To: req.body.telephone,
    From: 'Hackathon',
    Content: 'Hello from the Hackathon Starter',
  };
  clockwork.sendSms(message, (err, responseData) => {
    if (err) {
      return next(err.errDesc);
    }
    req.flash('success', { msg: `Text sent to ${responseData.responses[0].to}` });
    res.redirect('/api/clockwork');
  });
};

/**
 * GET /api/upload
 * File Upload API example.
 */

exports.getFileUpload = (req, res) => {
  res.render('api/upload', {
    title: 'File Upload',
  });
};

exports.postFileUpload = (req, res) => {
  req.flash('success', { msg: 'File was uploaded successfully.' });
  res.redirect('/api/upload');
};
