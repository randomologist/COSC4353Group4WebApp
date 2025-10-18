import request from "supertest";
import app from "../server.js";
import { describe, it, expect, beforeEach } from "vitest";
import { resetNotifs, getNotifs, addNotifs } from "../data/notifData.js";

describe("Notification API",() =>{
    beforeEach(() =>{//rudimentary notifs for testing
        resetNotifs([
            {id:1, eventID:1,message:"A", read:false},
            {id:2, eventID:2,message:"B", read:false},
            {id:3, eventID:3,message:"C", read:false},
            {id:4, eventID:4,message:"D", read:false},
            {id:5, eventID:5,message:"E", read:false},
            {id:6, eventID:6,message:"F", read:false},
            {id:7, eventID:7,message:"G", read:false},
        ]);
    });

  it("returns first page with default limit", async () => {
    const res = await request(app).get("/api/notifs");
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(5);
    expect(res.body.hasMore).toBe(true);
    expect(res.body.next).toBe(5);
  });

  it("returns second page using cursor", async () => {
    const res = await request(app).get("/api/notifs?cursor=5");
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(1);
    expect(res.body.items[0].id).toBe(6);
    expect(res.body.hasMore).toBe(false);
    expect(res.body.next).toBe(null);
  });

  it("returns empty array when cursor is at end", async () => {
    const res = await request(app).get("/api/notifs?cursor=6");
    expect(res.status).toBe(200);
    expect(res.body.items).toEqual([]);
    expect(res.body.hasMore).toBe(false);
    expect(res.body.next).toBe(null);
  });

  it("handles invalid cursor gracefully", async () => {
    const res = await request(app).get("/api/notifs?cursor=999");
    expect(res.status).toBe(200);
    expect(res.body.items).toEqual([]);
    expect(res.body.hasMore).toBe(false);
    expect(res.body.next).toBe(null);
  });

  it("respects custom limit", async () => {
    const res = await request(app).get("/api/notifs?limit=2");
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(2);
    expect(res.body.next).toBe(2);
  });

  it("returns consistent structure", async () => {
    const res = await request(app).get("/api/notifs");
    expect(res.body).toHaveProperty("items");
    expect(res.body).toHaveProperty("hasMore");
    expect(res.body).toHaveProperty("next");
  });
});