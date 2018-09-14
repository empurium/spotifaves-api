const Queue = require('bull');
const redisConfig = require('../config/redis');

const helloQueue = new Queue('hello', redisConfig);

helloQueue.process((job, done) => {
  console.log(`Started job ${job.id}.`);
  console.log(job.data);

  job.progress(10);

  setTimeout(() => {
    console.log('Job progress 25%');
    job.progress(25);
  }, 5 * 1000);

  setTimeout(() => {
    console.log('Job progress 45%');
    job.progress(45);
  }, 10 * 1000);

  setTimeout(() => {
    console.log('Job progress 85%');
    job.progress(85);
  }, 15 * 1000);

  setTimeout(() => {
    console.log(`Job ${job.id} complete!`);
    // done(new Error('Intentional error occurred!'));
    done();
  }, 20 * 1000);
});

module.exports = helloQueue;
