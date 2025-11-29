import {getEvents as dbGetEvents, addEvent as dbAddEvent, getEventById, updateEvent} from "../repositories/eventRepo.js"
let events = [
  {
    // mock event data
    id: 1,
    eventName: "Food Drive",
    location: "Houston",
    eventDate: "2025-10-20",
    startTime:"10:00",
    endTime:"15:00",
    requiredSkills: ["Organization", "Communication"],
    urgency: "High",
    description: "Help distribute food to local families."
  }
];
const mock = {
  getEvents: async() => events,
  resetEvents: async(data) => { events = data; return events},
  addEvent: async(event) => events.push(event)
};
const db={
  getEvents: dbGetEvents,
  resetEvents: async(data) => { events = data; return events},
  addEvent: dbAddEvent
}

//choose which you use
const active = db;
//exports
export const getEvents = active.getEvents;
export const resetEvents = active.resetEvents;
export const addEvent = active.addEvent;
