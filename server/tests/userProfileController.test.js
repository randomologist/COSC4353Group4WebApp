import request from "supertest";
import app from "../server";
import { describe, it, expect, beforeEach } from "vitest";
import { resetUserProfiles } from "../controllers/userProfileController";

describe("User Profile Controller", () => {
  beforeEach(() => {
    // set mock data users
    resetUserProfiles([
      {
        id: 1,
        fullName: "John Doe",
        address1: "123 Main St",
        address2: "Apt 4B",
        city: "Houston",
        state: "TX",
        zipCode: "77001",
        skills: ["Organization", "Communication"],
        preferences: "Prefer weekend events",
        availability: ["2025-10-20", "2025-10-27"]
      },
      {
        id: 2,
        fullName: "Jane Smith",
        address1: "456 Oak Ave",
        address2: "",
        city: "Houston",
        state: "TX",
        zipCode: "77002",
        skills: ["Teaching"],
        preferences: "Morning shifts preferred",
        availability: ["2025-10-21"]
      }
    ]);
  });

  // Test cases
  // get profile
  it("return a profile for valid ID", async () => {
    const res = await request(app).get("/api/userProfile/1");
    expect(res.status).toBe(200);
    expect(res.body.fullName).toBe("John Doe");
  });

  // update profile
  it("should update a user profile successfully", async () => {
    const updatedData = {
      fullName: "John Updated",
      address1: "789 New St",
      address2: "",
      city: "Houston",
      state: "TX",
      zipCode: "77003",
      skills: ["Communication"],
      preferences: "Evening shifts",
      availability: ["2025-11-01"]
    };

    const res = await request(app)
      .put("/api/userProfile/1")
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.fullName).toBe("John Updated");
  });

  // EMPTY field cases 
  // error if fullname is empty
  it("return 400 if fullName is empty", async () => {
    const res = await request(app)
      .put("/api/userProfile/1")
      .send({
        fullName: "",
        address1: "123 Main St",
        city: "Houston",
        state: "TX",
        zipCode: "77001",
        skills: ["Teaching"],
        availability: ["2025-10-20"]
      });
    expect(res.status).toBe(400);
  });

  // error if address1 is empty
  it("return 400 if address1 is empty", async () => {
    const res = await request(app)
      .put("/api/userProfile/1")
      .send({
        fullName: "John Doe",
        address1: "",
        city: "Houston",
        state: "TX",
        zipCode: "77001",
        skills: ["Teaching"],
        availability: ["2025-10-20"]
      });
    expect(res.status).toBe(400);
  });

  // error if city is empty
  it("return 400 if city is empty", async () => {
    const res = await request(app)
      .put("/api/userProfile/1")
      .send({
        fullName: "John Doe",
        address1: "123 Main St",
        city: "",
        state: "TX",
        zipCode: "77001",
        skills: ["Teaching"],
        availability: ["2025-10-20"]
      });
    expect(res.status).toBe(400);
  });

  // error if state is empty
  it("return 400 if state is empty", async () => {
    const res = await request(app)
      .put("/api/userProfile/1")
      .send({
        fullName: "John Doe",
        address1: "123 Main St",
        city: "Houston",
        state: "",
        zipCode: "77001",
        skills: ["Teaching"],
        availability: ["2025-10-20"]
      });
    expect(res.status).toBe(400);
  });

  // error if zipCode is empty
  it("return 400 if zipCode is empty", async () => {
    const res = await request(app)
      .put("/api/userProfile/1")
      .send({
        fullName: "John Doe",
        address1: "123 Main St",
        city: "Houston",
        state: "TX",
        zipCode: "",
        skills: ["Teaching"],
        availability: ["2025-10-20"]
      });
    expect(res.status).toBe(400);
  });

  // error if skills is empty/ 
  it("return 400 if skills is empty", async () => {
    const res = await request(app)
      .put("/api/userProfile/1")
      .send({
        fullName: "John Doe",
        address1: "123 Main St",
        city: "Houston",
        state: "TX",
        zipCode: "77001",
        skills: [],
        availability: ["2025-10-20"]
      });
    expect(res.status).toBe(400);
  });

  // error if availability is empty
  it("return 400 if availability is empty", async () => {
    const res = await request(app)
      .put("/api/userProfile/1")
      .send({
        fullName: "John Doe",
        address1: "123 Main St",
        city: "Houston",
        state: "TX",
        zipCode: "77001",
        skills: ["Teaching"],
        availability: []
      });
    expect(res.status).toBe(400);
  });

  // Invalid format cases based on requirements
  it("return 400 if state is invalid length", async () => {
    const res = await request(app)
      .put("/api/userProfile/1")
      .send({
        fullName: "John Doe",
        address1: "123 Main St",
        city: "Houston",
        state: "T",
        zipCode: "77001",
        skills: ["Teaching"],
        availability: ["2025-10-20"]
      });
    expect(res.status).toBe(400);
  });

  it("return 400 if zipCode is invalid format", async () => {
    const res = await request(app)
      .put("/api/userProfile/1")
      .send({
        fullName: "John Doe",
        address1: "123 Main St",
        city: "Houston",
        state: "TX",
        zipCode: "abc",
        skills: ["Teaching"],
        availability: ["2025-10-20"]
      });
    expect(res.status).toBe(400);
  });

  // Error cases
  it("return 404 if user doesn't exist", async () => {
    const res = await request(app).get("/api/userProfile/999");
    expect(res.status).toBe(404);
  });

  it("return 404 if updating a user that isn't in system", async () => {
    const res = await request(app)
      .put("/api/userProfile/999")
      .send({
        fullName: "nonUser",
        address1: "X",
        city: "Y",
        state: "TX",
        zipCode: "12345",
        skills: ["A"],
        availability: ["2025-12-01"]
      });
    expect(res.status).toBe(404);
  });
});