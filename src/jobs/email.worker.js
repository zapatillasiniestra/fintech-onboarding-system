const { getNextJob } = require("./email.queue");

function startEmailWorker() {
  setInterval(async () => {

    const job = getNextJob();

    if (!job) return;

    console.log(
      `
      --------------------------------
        To: ${job.email}
        Hello ${job.fullName},
        Your application has been ${job.status}.
        Regards,
        Nahuel.
      --------------------------------
      `
    );

    await new Promise(resolve =>
      setTimeout(resolve, 3000)
    );

    console.log(
      `[Worker] Email sent to ${job.email}`
    );

  }, 1000);
}

module.exports = {
  startEmailWorker
};