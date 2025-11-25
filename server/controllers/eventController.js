import { getEvents, resetEvents, addEvent } from "../data/eventData.js";

export const getAllEvents = (req, res) => {
  res.json(getEvents());
};

export const createEvent = (req, res) => {
  const {
    title,
    location,
    eventDate,
    startTime = null,
    endTime = null,
    skillsRequired = [],
    urgency = "Normal",
    description = "",
  } = req.body;

  if (!title || !location || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const events = getEvents();
  const newEvent = {
    id: events.length + 1,
    title,
    location,
    eventDate,
    skillsRequired,
    urgency,
    description,
  };

  addEvent(newEvent);
  return res.status(201).json(newEvent);
};
