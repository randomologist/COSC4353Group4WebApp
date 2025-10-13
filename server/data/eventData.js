let events = [
  {
    // mock event data
    id: 1,
    title: "Food Drive",
    location: "Houston",
    date: "2025-10-20",
    skillsRequired: ["Organization", "Communication"],
    urgency: "High",
    description: "Help distribute food to local families."
  }
];

exports.getEvents = () => events;
exports.resetEvents = (data) => { events = data; };
exports.addEvent = (event) => events.push(event);