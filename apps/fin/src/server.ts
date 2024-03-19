import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import patientsRouter from "./routes/patients";
import configFieldsRouter from "./routes/config-fields";

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use("/patients", patientsRouter)
    .use("/config-fields", configFieldsRouter);

  return app;
};
