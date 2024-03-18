import { Router, type RequestHandler } from "express";
import { Patient, PatientStatus, Prisma, prisma } from "@repo/database";

const router = Router();

router.get("/", (async (_, res) => {
  const patients = await prisma.patient.findMany();
  return res.json({ data: patients });
}) as RequestHandler);

router.post("/", (async (req, res) => {
  const input = req.body as Prisma.PatientCreateInput
  await prisma.patient.create({
    data: {
      first_name: input.first_name,
      middle_name: input.middle_name,
      last_name: input.last_name,
      status: input.status,
    }
  });
  return res.json({ data: null });
}) as RequestHandler);

export default router;
