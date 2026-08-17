import { Router } from "express";
import auth from "../middleware/auth.middleware";
import adminOnly from "../middleware/admin.middleware";
import applicationsController from "../controllers/applications.controller";

const router = Router();

router.get("/", auth, applicationsController.getApplications);
router.get("/stats", auth, applicationsController.getStats);
router.get(
  "/admin",
  auth,
  adminOnly,
  applicationsController.getAllApplications
);
router.get(
  "/admin/recent",
  auth,
  adminOnly,
  applicationsController.getRecents
);
router.get("/:id", auth, applicationsController.getApplicationsById);

router.get(
  "/:id/ai-audit",
  auth,
  applicationsController.getAIAudit
);

router.post("/", auth, applicationsController.createApplication);

router.patch(
  "/:id/status",
  auth,
  adminOnly,
  applicationsController.updateStatus
);

export default router;
