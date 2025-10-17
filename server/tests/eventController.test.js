import request from "supertest";
import app from "../server";
import { describe, it, expect, beforeEach } from "vitest";
import { resetEvents } from "../data/eventData.js";
import * as eventData from '../data/eventData.js';

describe("Event Controller", () => {
  beforeEach(() => {
    resetEvents([
      {
        id: 1,
        title: "Food Drive",
        location: "Houston",
        date: "2025-10-20",
        skillsRequired: ["Organization", "Communication"],
        urgency: "High",
        description: "Help distribute food to local families.",
      },
    ]);
  });

  it("return events", async () => {
    const res = await request(app).get("/api/events");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe("Food Drive");
  });

  it("create a new event", async () => {
    const newEvent = {
      title: "Beach Cleanup",
      location: "Galveston",
      date: "2025-11-05",
      skillsRequired: ["Teamwork"],
      urgency: "Medium",
      description: "Help clean up the beach.",
    };

    const res = await request(app).post("/api/events").send(newEvent);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(newEvent);
  });

  it("return 400 if required fields are missing", async () => {
    const res = await request(app).post("/api/events").send({
      title: "",
      location: "",
      date: "",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Missing required fields");
  });

  // added more unit tests for getEvents
  it('eventData.resetEvents([]) clears list', () => {
    eventData.resetEvents([]);
    const list = eventData.getEvents();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(0);
  });

  it('eventData.addEvent() appends an event and getEvents() returns it', () => {
    eventData.resetEvents([]);
    const newEvent = {
      id: 42,
      title: 'Park Cleanup',
      location: 'Memorial Park',
      date: '2025-12-01',
      skillsRequired: ['Teamwork'],
      urgency: 'Low',
      description: 'Rake leaves and bag trash.'
    };
    eventData.addEvent(newEvent);

    const list = eventData.getEvents();
    expect(list.length).toBe(1);
    expect(list[0]).toMatchObject(newEvent);
  });

  it('eventData.addEvent() can add multiple items', () => {
    eventData.resetEvents([]);
    eventData.addEvent({ id: 1, title: 'A' });
    eventData.addEvent({ id: 2, title: 'B' });
    const list = eventData.getEvents();
    expect(list.map(e => e.id)).toEqual([1, 2]);
  });
});
