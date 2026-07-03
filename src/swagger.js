const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fintech Onboarding API",
      version: "1.0.0",
      description: "REST API for onboarding applications"
    },
    servers: [
      {
        url: "http://localhost:3000"
      },
      {
        url: "https://fintech-onboarding-system.onrender.com"
      }
    ]
  },
  apis: ["./src/routes/*.js"]
};

module.exports = swaggerJsdoc(options);