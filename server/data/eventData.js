let events = [
  {
    // mock event data
    id: 1,
    title: "Food Drive",
    location: "Houston",
    eventDate: "2025-10-20",
    skillsRequired: ["Organization", "Communication"],
    urgency: "High",
    description: "Help distribute food to local families."
  }
];
const mock = {
  getEvents: () => events,
  resetEvents: (data) => { events = data; },
  addEvent: (event) => events.push(event)
};

/*const db = {
  getEvents: (),
  resetEvents: (data),
  addEvent: (event) => 
}*/
//choose which you use
const active = mock;
//exports
export const getEvents = active.getEvents;
export const resetEvents = active.getEvents;
export const addEvent = active.getEvents;
