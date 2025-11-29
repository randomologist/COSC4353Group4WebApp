const {
  getEvents,
  addEvent,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../data/eventData.js");

const getAllEvents = async (req, res) => {
  const events = await getEvents();
  res.json(events);
};

const createEvent = async(req, res) => {
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

  const events = await getEvents();
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

  const saved = await addEvent(newEvent);
  return res.status(201).json(saved);
};

const getEvent = async(req, res) => {
  const id = parseInt(req.params.id);
  const event = await getEventById(id);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json(event);
};

const updateEventById = async(req, res) => {
  const id = parseInt(req.params.id);
  const updated = await updateEvent(id, req.body);

  if (!updated) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json(updated);
};

const deleteEventById = async(req, res) => {
  const id = parseInt(req.params.id);
  const deleted = await deleteEvent(id);

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
