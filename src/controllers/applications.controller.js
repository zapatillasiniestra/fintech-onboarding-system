const applicationsService = require("../services/applications.service");

async function getApplications(req, res) {
  console.log(req.user);
  const applications = await applicationsService.getApplications(req.user.userId);
  res.json(applications);
}

async function createApplication(req, res) {
  const { full_name, email } = req.body;

  if (!full_name) {
    return res.status(400).json({ error: "data is required" });
  }

  const application = await applicationsService.createApplication(
    req.user.userId,
    full_name,
    email
  );

  res.json(application);
}

async function updateStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const application = await applicationsService.updateStatus(
    id,
    req.user.userId,
    status
  );

  res.json(application);
}

module.exports = {
  getApplications,
  createApplication,
  updateStatus
};
