import express from "express";
import router from "./router";
import morgan from "morgan";
import cors from "cors";
import swaggerUI from "swagger-ui-express"

import { protectRoutes } from "./modules/auth";
import { createNewUser, signIn } from "./handlers/user";
import { body } from "express-validator";
import { handleValidationErrors } from "./modules/validation";
import { handleRuntimeError } from "./modules/error";
import { openapiSpecification } from "./swagger"

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("hello from express");
  throw new Error("Hahahahha");
});

app.use("/docs", swaggerUI.serve, swaggerUI.setup(openapiSpecification));

app.use("/api", protectRoutes, router);
app.post(
  "/user",
  ...[body("username").isString(), body("password").isString()],
  handleValidationErrors,
  createNewUser
);
app.post(
  "/sign_in",
  ...[body("username").isString(), body("password").isString()],
  handleValidationErrors,
  signIn
);

app.use(handleRuntimeError);

export default app;
