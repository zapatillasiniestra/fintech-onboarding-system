import express from "express";
import authRoutes from "./routes/auth.routes";
import applicationsRoutes from "./routes/applications.routes";
import errorHandler from "./middleware/error.middleware";
import requestLogger from "./middleware/logger.middleware";
import healthRoutes from "./routes/health.routes";

const app = express();

app.use(express.json());

app.use(requestLogger);

app.use("/", authRoutes);
app.use("/applications", applicationsRoutes);
app.use("/", healthRoutes);

app.use(errorHandler);

export default app;
