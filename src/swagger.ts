import path from "path";
import swaggerJsdoc from "swagger-jsdoc" 

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Chronos API",
      version: "1.0.0",
    },
  },
  apis: [path.resolve(__dirname, "./router.ts"), path.resolve(__dirname, "./handlers/**/*.ts")],
};

export const openapiSpecification = swaggerJsdoc(options);
