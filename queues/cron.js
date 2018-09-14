const Queue = require('bull');
const redisConfig = require('../config/redis');

const cronQueue = new Queue('cron', redisConfig);

cronQueue.process((job) => {
  console.log(`Started job ${job.id}.`);
  console.log(job.data);

  job.progress(10);

  setTimeout(() => {
    console.log('Job progress 20%');
    job.progress(20);
  }, 5 * 1000);

  setTimeout(() => {
    console.log('Job progress 40%');
    job.progress(40);
  }, 10 * 1000);

  setTimeout(() => {
    console.log('Job progress 90%');
    job.progress(90);
  }, 15 * 1000);

  setTimeout(() => {
    console.log(`Job ${job.id} complete!`);
  }, 20 * 1000);
});

// Run every 5 minutes per cron spec
// cronQueue.add({}, { repeat: { cron: '*/5 * * * *' } });

module.exports = cronQueue;
