import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nahuela",
      version: "1.0.0",
      description: "Open-source infrastructure for auditable, provider-agnostic AI-powered onboarding and regulated decision systems."
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
