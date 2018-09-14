const Arena = require('bull-arena');
const redisConfig = require('./redis');

module.exports = Arena(
  {
    queues: [
      {
        name: 'hello',
        hostId: 'Queue',
        ...redisConfig,
      },
      {
        name: 'cron',
        hostId: 'Queue',
        ...redisConfig,
      },
    ],
  },
  {
    basePath: '/queues',
    listenExpress: true,
  },
);
