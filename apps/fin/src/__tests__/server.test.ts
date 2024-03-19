import supertest from "supertest";
import { createServer } from "../server";

describe("server", () => {
  it("returns patients", async () => {
    await supertest(createServer())
      .get("/patients")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it("creates a patient", async () => {
    await supertest(createServer())
      .post("/patients")
      .expect(200)
      .send({
        first_name: "Alex",
        middle_name: "Brownie",
        last_name: "Clive",
        dob: "1991-01-01",
        status: "Inquiry",
      })
      .then((res) => {
        expect(res.body.data.first_name).toBe("Alex");
        expect(res.body.data.middle_name).toBe("Brownie");
        expect(res.body.data.last_name).toBe("Clive");
      });
  });

  it("fails if missing data", async () => {
    await supertest(createServer()).post("/patients").expect(400).send({
      first_name: "Alex",
    });
  });
});
