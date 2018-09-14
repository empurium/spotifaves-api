const dotenv = require('dotenv');

dotenv.load();

module.exports = {
  redis: {
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },
};
