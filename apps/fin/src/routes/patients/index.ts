import { Router, type RequestHandler } from "express";
import { prisma, type Prisma, type PatientStatus } from "@repo/database/server";

const router = Router();

router.get("/", (async (req, res) => {
  try {
    let patients = [];
    const filters = req.query.filters as
      | Record<string, string | string[]>
      | undefined;
    const sortKey = req.query.sortKey as string | undefined;
    const sortVal = req.query.sortVal as string | undefined;
    patients = await prisma.patient.findMany({
      where: {
        OR: filters
          ? [
              ...(filters.first_name
                ? [{ first_name: { search: filters.first_name as string } }]
                : []),
              ...(filters.middle_name
                ? [{ middle_name: { search: filters.middle_name as string } }]
                : []),
              ...(filters.last_name
                ? [{ last_name: { search: filters.last_name as string } }]
                : []),
              ...(filters.dob
                ? [{ dob: { search: filters.dob as string } }]
                : []),
              ...(filters.status
                ? [
                    {
                      status: {
                        in: (Array.isArray(filters.status)
                          ? filters.status
                          : [filters.status]) as PatientStatus[],
                      },
                    },
                  ]
                : []),
            ]
          : undefined,
      },
      orderBy: {
        [sortKey || "created_at"]: sortVal || "desc",
      },
    });
    return res.json({ data: patients });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong." });
  }
}) as RequestHandler);

router.post("/", (async (req, res) => {
  const input = req.body as Prisma.PatientCreateInput;
  const patient = await prisma.patient.create({
    data: {
      first_name: input.first_name,
      middle_name: input.middle_name,
      last_name: input.last_name,
      dob: input.dob,
      status: input.status,
      patient_addresses: {
        createMany: {
          data: [{}],
        },
      },
    },
  });
  return res.json({ data: patient });
}) as RequestHandler);

export default router;
