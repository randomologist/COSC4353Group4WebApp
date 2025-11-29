const {
  getEvents,
  addEvent,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../repositories/eventRepo.js");

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

const getEvent = (req, res) => {
  const id = parseInt(req.params.id);
  const event = getEventById(id);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json(event);
};

const updateEventById = (req, res) => {
  const id = parseInt(req.params.id);
  const updated = updateEvent(id, req.body);

  if (!updated) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json(updated);
};

const deleteEventById = (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = deleteEvent(id);

  if (!deleted) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json({ message: "Event deleted successfully" });
};

module.exports = {
  getAllEvents,
  createEvent,
  getEvent,
  updateEventById,
  deleteEventById,
};
