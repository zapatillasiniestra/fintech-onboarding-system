const applicationsService = require("../services/applications.service");
const STATUS = require("../constants/applicationStatus");

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Get paginated applications
 *     tags:
 *       - Applications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of applications
 */

async function getApplications(req, res) {
  console.log(req.user);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  const search = req.query.search;
  const order = req.query.order;

  const applications = await applicationsService.getApplications(
    req.user.userId,
    page,
    limit,
    status,
    search,
    order
  );
  res.json(applications);
}

async function getAllApplications(req, res) {
  console.log(req.user);
  const applications = await applicationsService.getAllApplications(req.user.userId);
  res.json(applications);
}

async function getApplicationsById(req, res) {
  console.log(req.params.id);
  const applications = await applicationsService.getApplicationsById(req.params.id);
  res.json(applications);
}

async function getStats(req, res) {
  console.log(req.user);
  const applications = await applicationsService.getStats(req.user.userId);
  res.json(applications);
}

async function getRecents(req, res) {
  console.log(req.user);
  const applications = await applicationsService.getRecents(req.user.userId);
  res.json(applications);
}

async function createApplication(req, res) {
  const {
    createApplicationSchema
  } = require("../validators/applications.validator");

  const data =
  createApplicationSchema.parse(req.body);

  const { full_name, email } = data;
  // if (!full_name||!email) {
  //   return res.status(400).json({ error: "data is required" });
  // }

  // const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //   if (!pattern.test(email)) {
  //     return res.status(400).json({ error: "invalid email" });
  //   };
  
  const application = await applicationsService.createApplication(
    req.user.userId,
    full_name,
    email
  );

  res.json(application);
}

async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // const validStatuses = STATUS;

    const {
      updateStatusSchema
    } = require("../validators/applications.validator");

    const { status } =
    updateStatusSchema.parse(req.body);

    const application =
      await applicationsService.updateStatus(
        id,
        // req.user.userId,
        status
      );

    return res.json(application);

  } catch(err) {
    next(err);
  }
}

module.exports = {
  getApplications,
  getAllApplications,
  getApplicationsById,
  getStats,
  getRecents,
  createApplication,
  updateStatus
};
