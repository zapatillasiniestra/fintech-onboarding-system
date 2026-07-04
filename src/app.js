const express=require("express");
const authRoutes=require("./routes/auth.routes");
const applicationsRoutes=require("./routes/applications.routes");
const errorHandler=equire("./middleware/error.middleware");
const requestLogger = require("./middleware/logger.middleware");

const app=express();

app.use(express.json());
app.use("/",authRoutes);
app.use("/applications",applicationsRoutes);
app.use(errorHandler);
app.use(requestLogger);

module.exports=app;
