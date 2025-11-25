import { getEvents, resetEvents, addEvent } from "../data/eventData.js";

export const getAllEvents = (req, res) => {
  res.json(getEvents());
};

export const createEvent = (req, res) => {
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
    startTime,
    endTime,
    requiredSkills,
    urgency,
    description,
  };

  addEvent(newEvent);
  return res.status(201).json(newEvent);
};
