const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/admin.middleware");
const applicationsController = require("../controllers/applications.controller");

console.log("applications routes loaded");

router.get("/", auth, applicationsController.getApplications);
router.get("/stats", auth, applicationsController.getStats);
router.get(
  "/admin",
  auth,
  adminOnly,
  applicationsController.getAllApplications
);
router.get("/:id", auth, applicationsController.getApplicationsById);

router.post("/", auth, applicationsController.createApplication);

router.patch(
  "/:id/status",
  auth,
  applicationsController.updateStatus
);

module.exports = router;
