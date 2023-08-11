import path from "path";
import swaggerJsdoc from "swagger-jsdoc" 

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Change Log API",
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
        PaginatedData: {
          type: "object",
          properties: {
            total: {
              type: "integer",
              minimum: 1
            },
            data: {
              type: "array",
              items: {},
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
    parameters: {
      page: {
        in: "query",
        name: "page",
        required: false,
        type: "integer",
        minimum: 1,
        description: "For describing which page to get on a paginated GET",
      },
      'page_size': {
        in: "query",
        name: "page_size",
        required: false,
        type: "integer",
        minimum: 1,
        description: "For describing how many records to include in a page on a paginated GET",
      },
    },
  },
  apis: [
    path.resolve(__dirname, "./router.ts"),
    path.resolve(__dirname, "./handlers/**/*.ts"),
  ],
};

export const openapiSpecification = swaggerJsdoc(options);
