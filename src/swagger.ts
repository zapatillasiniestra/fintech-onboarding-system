import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nahuela API",
      version: "1.0.0",
      description: "Open-source API for auditable onboarding and regulated decision systems."
    },
    servers: [
      {
        url: "http://localhost:3000"
      },
      {
        url: "https://fintech-onboarding-system.onrender.com"
      }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
            }
        }
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts", "./src/types/*.ts"]
};

export default swaggerJsdoc(options);
