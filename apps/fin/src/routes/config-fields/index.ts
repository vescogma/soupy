import { Router, type RequestHandler } from "express";
import { prisma, type Prisma } from "@repo/database/server";

const router = Router();

router.get("/", (async (_, res) => {
  try {
    const configFields = await prisma.configField.findMany({
      orderBy: { created_at: "desc" },
    });
    return res.json({ data: configFields });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
}) as RequestHandler);

router.post("/", (async (req, res) => {
  try {
    const input = req.body as Prisma.ConfigFieldCreateInput;
    const configField = await prisma.configField.create({
      data: {
        type: input.type,
        label: input.label,
      },
    });
    return res.json({ data: configField });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
}) as RequestHandler);

export default router;
