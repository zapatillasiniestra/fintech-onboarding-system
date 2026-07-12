const jobs = [];

function addEmailJob(job) {
  jobs.push(job);
}

function getNextJob() {
  return jobs.shift();
}

module.exports = {
  addEmailJob,
  getNextJob
};