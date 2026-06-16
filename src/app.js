const express=require("express");
const authRoutes=require("./routes/auth.routes");
const applicationsRoutes=require("./routes/applications.routes");

const app=express();

app.use(express.json());
app.use("/",authRoutes);
app.use("/applications",applicationsRoutes);

module.exports=app;
