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
  getEvents: () => events,
  resetEvents: (data) => { events = data; },
  addEvent: (event) => events.push(event)
};


//choose which you use
const active = mock;
//exports
export const getEvents = active.getEvents;
export const resetEvents = active.resetEvents;
export const addEvent = active.addEvent;
