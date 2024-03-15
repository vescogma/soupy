import { json, urlencoded } from "body-parser";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import patientsRouter from "./routes/patients";

export const createServer = () => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use("/patients", patientsRouter)
    .get("/healthz", (_, res) => {
      return res.json({ ok: true });
    });
  return app;
};
