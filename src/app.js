const express = require("express");
const authRoutes = require("./routes/auth.routes");
const applicationsRoutes = require("./routes/applications.routes");
const adminRoutes = require("./routes/admin.routes");
const errorHandler = require("./middleware/error.middleware");
const requestLogger = require("./middleware/logger.middleware");
const healthRoutes = require("./routes/health.routes");

const app = express();

app.use(express.json());

app.use(requestLogger);

app.use("/", authRoutes);
app.use("/", adminRoutes);
app.use("/applications", applicationsRoutes);
app.use("/", healthRoutes);

app.use(errorHandler);

module.exports = app;