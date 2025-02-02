import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "URL Shortener API",
      version: "1.0.0",
      description: "API documentation for the URL shortener service",
    },
    components: {
      schemas: {
        Url: {
          type: "object",
          properties: {
            urlId: {
              type: "string",
              description: "Unique identifier for the shortened URL",
              example: "abc123",
            },
            longUrl: {
              type: "string",
              description: "The original (long) URL",
              example: "https://www.example.com",
            },
            clicks: {
              type: "number",
              description: "Number of times the short URL was clicked",
              example: 42,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the short URL was created",
            },
          },
          required: ["urlId", "longUrl"],
        },
      },
    },
  },
  apis: ["./routes/*.js"], // or wherever your route files are located
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
