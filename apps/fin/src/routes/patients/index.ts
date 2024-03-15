import { Router, type RequestHandler } from "express";
import { prisma } from "@repo/database";

const router = Router();

router.get("/", (async (_, res) => {
  const patients = await prisma.patient.findMany();
  return res.json({ data: patients });
}) as RequestHandler);

export default router;
