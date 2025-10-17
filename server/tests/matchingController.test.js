import request from "supertest";
import app from "../server.js";
import { describe, it, expect, beforeEach } from "vitest";
import { resetAssignments } from "../data/matchingData.js";
import { resetUserProfiles } from "../controllers/userProfileController.js";
import { resetEvents } from "../data/eventData.js";
import * as matchingData from "../data/matchingData.js";

describe("Volunteer Matching Controller", () => {
  beforeEach(() => {
    // reset data and set mock data
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

    resetEvents([
      {
        // reset mock events with data
        id: 1,
        title: "Food Drive",
        location: "Houston",
        date: "2025-10-20",
        skillsRequired: ["Organization", "Communication"],
        urgency: "High",
        description: "Help distribute food to local families."
      },
      {
        id: 2,
        title: "Teaching Event",
        location: "Houston",
        date: "2025-10-21",
        skillsRequired: ["Teaching"],
        urgency: "Medium",
        description: "Help with tutoring."
      }
    ]);

    resetAssignments([]);
  });

  // Test cases
  // get voluneteers
  it("return all volunteers", async () => {
    const res = await request(app).get("/api/matching/volunteers");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("name");
    expect(res.body[0]).toHaveProperty("skills");
  });

  // get event
  it("return matched events for a volunteer", async () => {
    const res = await request(app).get("/api/matching/matches/1");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // error if volunteer not there
  it("return 404 if volunteer not found", async () => {
    const res = await request(app).get("/api/matching/matches/999");
    expect(res.status).toBe(404);
  });

  // no eevents found
  it("return empty array if no matching events", async () => {
    const res = await request(app).get("/api/matching/matches/2");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // test volunteer assignment
  it("assign a volunteer to an event", async () => {
    const res = await request(app)
      .post("/api/matching/assign")
      .send({
        volunteerId: 1,
        eventId: 1
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.status).toBe("Assigned");
  });

  // error hadle if volunteer id missing
  it("return 400 if missing volunteerId", async () => {
    const res = await request(app)
      .post("/api/matching/assign")
      .send({
        eventId: 1
      });
    expect(res.status).toBe(400);
  });

  // error handling if event id missing
  it("return 400 if missing eventId", async () => {
    const res = await request(app)
      .post("/api/matching/assign")
      .send({
        volunteerId: 1
      });
    expect(res.status).toBe(400);
  });

  // error handling if volunteer not found
  it("return 404 if volunteer not found on assign", async () => {
    const res = await request(app)
      .post("/api/matching/assign")
      .send({
        volunteerId: 999,
        eventId: 1
      });
    expect(res.status).toBe(404);
  });

  // error handling if event not found
  it("return 404 if event not found on assign", async () => {
    const res = await request(app)
      .post("/api/matching/assign")
      .send({
        volunteerId: 1,
        eventId: 999
      });
    expect(res.status).toBe(404);
  });

  // prevent duplicate assignments
  it("prevent duplicate assignments", async () => {
    await request(app)
      .post("/api/matching/assign")
      .send({
        volunteerId: 1,
        eventId: 1
      });

    const res = await request(app)
      .post("/api/matching/assign")
      .send({
        volunteerId: 1, // duplicate
        eventId: 1 // duplicate
      });
    expect(res.status).toBe(400);
  });

  // get assignments
  it("return all assignments", async () => {
    const res = await request(app).get("/api/matching/assignments");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // testing the functions
  it("matchingData.resetAssignments([]) clears list", () => {
    matchingData.resetAssignments([{ id: 1 }, { id: 2 }]);
    let list = matchingData.getAssignments();
    expect(list.length).toBe(2);

    matchingData.resetAssignments([]);
    list = matchingData.getAssignments();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(0);
  });

  it("matchingData.addAssignment() appends an assignment and getAssignments() returns it", () => {
    matchingData.resetAssignments([]);
    const a = { id: 101, volunteerId: 1, eventId: 1, status: "Assigned" };
    matchingData.addAssignment(a);
    const list = matchingData.getAssignments();
    expect(list.length).toBe(1);
    expect(list[0]).toMatchObject(a);
  });

  it("matchingData.addAssignment() supports multiple adds", () => {
    matchingData.resetAssignments([]);
    matchingData.addAssignment({ id: 1 });
    matchingData.addAssignment({ id: 2 });
    const list = matchingData.getAssignments();
    expect(list.map(x => x.id)).toEqual([1, 2]);
  });
});