import path from "path";
import swaggerJsdoc from "swagger-jsdoc" 

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Chronos API",
      version: "1.0.0",
    },
    components: {
      schemas: {
        Error: {
          type: "object",
          required: ["message"],
          properties: {
            message: {
              type: "string",
              description:
                "The message describing what went wrong in an operation",
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    path.resolve(__dirname, "./router.ts"),
    path.resolve(__dirname, "./handlers/**/*.ts"),
  ],
};

export const openapiSpecification = swaggerJsdoc(options);
