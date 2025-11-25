const { getEvents, addEvent } = require("../repositories/eventRepo.js");

const getAllEvents = (req, res) => {
  res.json(getEvents());
};

const createEvent = (req, res) => {
  const {
    eventName,
    location,
    eventDate,
    startTime,
    endTime,
    requiredSkills = [],
    urgency = "Normal",
    description = "",
  } = req.body;

  if (!eventName || !location || !eventDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const events = getEvents();
  const newEvent = {
    id: events.length + 1,
    eventName,
    location,
    eventDate,
    startTime: startTime || "00:00",
    endTime: endTime || "23:59",
    requiredSkills,
    urgency,
    description,
  };

  addEvent(newEvent);
  return res.status(201).json(newEvent);
};

module.exports = { getAllEvents, createEvent}