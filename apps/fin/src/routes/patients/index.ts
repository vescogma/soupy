import { z } from "zod";
import { Router, type RequestHandler } from "express";
import {
  prisma,
  type Prisma,
  PatientStatus,
  type Patient,
} from "@repo/database/server";
import { validate } from "../../lib/validate";

const STATUSES = [
  PatientStatus.Active,
  PatientStatus.Churned,
  PatientStatus.Inquiry,
  PatientStatus.Onboarding,
] as const;
const SORT_KEYS = [
  "created_at",
  "first_name",
  "middle_name",
  "last_name",
  "dob",
  "status",
] as const;
const SORT_VALS = ["asc", "desc"] as const;

const router = Router();

const getQuerySchema = z.object({
  filters: z
    .object({
      first_name: z.string().optional(),
      middle_name: z.string().optional(),
      last_name: z.string().optional(),
      dob: z.string().optional(),
      status: z.enum(STATUSES).optional(),
    })
    .optional(),
  sortKey: z.enum(SORT_KEYS).optional(),
  sortVal: z.enum(SORT_VALS).optional(),
});

router.get("/", validate("query", getQuerySchema), (async (req, res) => {
  try {
    const query = req.query as z.infer<typeof getQuerySchema>;
    const patients = await prisma.patient.findMany({
      where: {
        OR: query.filters
          ? [
              ...searchPartial("first_name", query.filters.first_name),
              ...searchPartial("middle_name", query.filters.middle_name),
              ...searchPartial("last_name", query.filters.last_name),
              ...searchPartial("dob", query.filters.dob),
              ...(query.filters.status
                ? [
                    {
                      status: {
                        in: (Array.isArray(query.filters.status)
                          ? query.filters.status
                          : [query.filters.status]) as PatientStatus[],
                      },
                    },
                  ]
                : []),
            ]
          : undefined,
      },
      orderBy: {
        [query.sortKey || SORT_KEYS[0]]: query.sortVal || SORT_VALS[0],
      },
    });
    return res.json({ data: patients });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
}) as RequestHandler);

const postPayloadSchema = z.object({
  first_name: z.string(),
  middle_name: z.string(),
  last_name: z.string(),
  dob: z.string(),
  status: z.enum(STATUSES),
  config: z.string().optional(),
  patient_addresses: z
    .object({
      create: z.array(
        z.object({
          line_1: z.string(),
          line_2: z.string().optional(),
          city: z.string(),
          state: z.string(),
        })
      ),
    })
    .optional(),
});

router.post("/", validate("body", postPayloadSchema), (async (req, res) => {
  try {
    const payload = req.body as z.infer<typeof postPayloadSchema>;
    const patient = await prisma.patient.create({
      data: {
        first_name: payload.first_name,
        middle_name: payload.middle_name,
        last_name: payload.last_name,
        dob: payload.dob,
        status: payload.status,
        config: payload.config,
        patient_addresses: payload.patient_addresses,
      },
    });
    return res.json({ data: patient });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
}) as RequestHandler);

export default router;

const searchPartial = (
  col: string,
  query?: string
): Prisma.PatientWhereInput[] => (query ? [{ [col]: { search: query } }] : []);
