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
