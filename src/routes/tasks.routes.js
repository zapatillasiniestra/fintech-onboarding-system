const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const tasksController = require("../controllers/tasks.controller");

router.get("/", auth, tasksController.getTasks);
router.post("/", auth, tasksController.createTask);

module.exports = router;
