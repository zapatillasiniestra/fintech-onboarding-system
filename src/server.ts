import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import app from "./app";

const PORT = Number(process.env.PORT) || 3000;

import startEmailWorker from "./jobs/email.worker";

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