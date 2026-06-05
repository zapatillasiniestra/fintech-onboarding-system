const tasksService = require("../services/tasks.service");

async function getTasks(req, res) {
  const tasks = await tasksService.getTasks(req.user.userId);
  res.json(tasks);
}

async function createTask(req, res) {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  const task = await tasksService.createTask(
    req.user.userId,
    title
  );

  res.json(task);
}

module.exports = {
  getTasks,
  createTask
};
