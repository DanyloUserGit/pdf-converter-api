import express from "express";
import convertRouter from "./router";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/convert", convertRouter);

const swaggerSpec = swaggerJsdoc({
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Universal File Converter API",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.ts"],
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
