import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nahuela",
      version: "1.0.0",
      description:
        "Open-source infrastructure for auditable, provider-agnostic AI-powered onboarding and regulated decision systems.",
    },

    servers: [
      {
        url: "http://localhost:3000",
      },
      {
        url: "https://fintech-onboarding-system.onrender.com",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    paths: {
      "/applications": {
        post: {
          tags: ["Applications"],
          summary: "Create a new onboarding application",
          description:
            "Creates an application and runs identity verification, compliance checks, and AI assessment.",
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["full_name", "email"],
                  properties: {
                    full_name: {
                      type: "string",
                      example: "Test User",
                    },
                    email: {
                      type: "string",
                      format: "email",
                      example: "test@example.com",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Application created",
            },
            400: {
              description:
                "Validation or identity verification error",
            },
            401: {
              description: "Authentication required",
            },
          },
        },
      },

      "/applications/{id}/decision-history": {
        get: {
          tags: ["Applications"],
          summary: "Get application decision history",
          description:
            "Returns identity verification, compliance checks, AI assessments, audit events, and audit-chain verification.",
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Application ID",
              schema: {
                type: "integer",
              },
            },
          ],
          responses: {
            200: {
              description:
                "Complete onboarding decision history",
              content: {
                "application/json": {
                  example: {
                    applicationId: 75,

                    identity: [
                      {
                        id: 8,
                        application_id: 75,
                        provider: "mock",
                        verified: true,
                        confidence: "0.99",
                        decision: "approved",
                        reasons: [],
                        external_id: "mock-123",
                        created_at:
                          "2026-08-20T17:52:55.832Z",
                      },
                    ],

                    compliance: [
                      {
                        id: 19,
                        application_id: 75,
                        provider: "local",
                        decision: "clear",
                        reasons: [],
                        external_id: "local-75",
                        created_at:
                          "2026-08-20T17:52:55.832Z",
                      },
                    ],

                    aiAssessments: [
                      {
                        id: 119,
                        application_id: 75,
                        risk_level: "low",
                        decision: "approved",
                        reasons: [
                          "No significant risk indicators detected.",
                        ],
                        model: "mock",
                        created_at:
                          "2026-08-20T17:52:55.832Z",
                      },
                    ],

                    auditVerification: {
                      valid: true,
                      events: 4,
                    },
                  },
                },
              },
            },

            400: {
              description: "Invalid application ID",
            },

            401: {
              description: "Authentication required",
            },

            403: {
              description: "Forbidden",
            },

            404: {
              description: "Application not found",
            },
          },
        },
      },

      "/applications/{id}/ai-audit/verify": {
        get: {
          tags: ["Audit"],
          summary: "Verify the application's audit chain",
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "integer",
              },
            },
          ],
          responses: {
            200: {
              description: "Audit chain verification result",
              content: {
                "application/json": {
                  example: {
                    valid: true,
                    events: 4,
                  },
                },
              },
            },
            400: {
              description: "Invalid application ID",
            },
            401: {
              description: "Authentication required",
            },
            403: {
              description: "Forbidden",
            },
            404: {
              description: "Application not found",
            },
          },
        },
      },
    },
  },

  apis: [
    "./src/routes/*.ts",
    "./src/controllers/*.ts",
    "./src/types/*.ts",
  ],
};

export default swaggerJsdoc(options);