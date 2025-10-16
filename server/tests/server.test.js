import request from "supertest";
import app from "../server";
import { describe, it, expect, beforeEach } from "vitest";

describe("Server basic setup", () => {
  it("should respond to GET /api/events", async () => {
    const res = await request(app).get("/api/events");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should respond to GET /api/userProfile/1", async () => {
    const res = await request(app).get("/api/userProfile/1");
    expect([200, 404]).toContain(res.status); // allows either existing or missing
  });
});
