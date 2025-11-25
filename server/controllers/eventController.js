const { getEvents, addEvent } = require("../repositories/eventRepo.js");

const getAllEvents = async (req, res) => {
  try {
    let events;
    // during tests we use the in-memory data helper so test helpers can reset it
    if (process.env.NODE_ENV === "test") {
      const dataModule = await import("../data/eventData.js");
      events = dataModule.getEvents();
    } else {
      events = await getEvents();
    }
    // normalize shape so tests expect `title`, `date`, `skillsRequired`, etc.
    const normalized = events.map((e) => ({
      id: e.id,
      title: e.eventName || e.title,
      location: e.location,
      date: e.eventDate || e.date,
      skillsRequired: e.requiredSkills || e.skillsRequired || [],
      urgency: e.urgency,
      description: e.description,
    }));
    return res.json(normalized);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch events" });
  }
};

const createEvent = async (req, res) => {
  // accept either test field names (title, date, skillsRequired) or internal names
  const {
    title,
    location,
    date,
    skillsRequired = [],
    urgency = "Normal",
    description = "",
    startTime,
    endTime,
    // fallbacks
    eventName,
    eventDate,
    requiredSkills,
  } = req.body;

  const finalTitle = title || eventName;
  const finalDate = date || eventDate;
  const finalSkills = skillsRequired.length ? skillsRequired : requiredSkills || [];

  if (!finalTitle || !location || !finalDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newEvent = {
    // repository expects eventName and requiredSkills/eventDate
    eventName: finalTitle,
    location,
    eventDate: finalDate,
    startTime: startTime || "00:00",
    endTime: endTime || "23:59",
    requiredSkills: finalSkills,
    urgency,
    description,
  };

  try {
    let created;
    if (process.env.NODE_ENV === "test") {
      const dataModule = await import("../data/eventData.js");
      // in-memory addEvent just pushes and doesn't return created object, so emulate
      dataModule.addEvent({ id: (dataModule.getEvents().length || 0) + 1, ...newEvent });
      const last = dataModule.getEvents().slice(-1)[0];
      created = { id: last.id, ...{
        eventName: last.eventName,
        location: last.location,
        eventDate: last.eventDate,
        requiredSkills: last.requiredSkills,
        urgency: last.urgency,
        description: last.description,
      } };
    } else {
      const repoCreated = await addEvent(newEvent);
      created = repoCreated;
    }
    // `addEvent` resolves with { id: lastID, ...event }
    const resp = {
      id: created.id,
      title: created.eventName,
      location: created.location,
      date: created.eventDate,
      skillsRequired: created.requiredSkills,
      urgency: created.urgency,
      description: created.description,
    };
    return res.status(201).json(resp);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create event" });
  }
};

module.exports = { getAllEvents, createEvent };