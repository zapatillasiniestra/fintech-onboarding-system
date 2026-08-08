import "dotenv/config";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import app from "./app";

import startEmailWorker from "./jobs/email.worker";

const PORT = Number(process.env.PORT) || 3000;

startEmailWorker();

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;