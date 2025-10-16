const { getEvents } = require("../data/eventData.js");
const { getUserProfiles } = require("../controllers/userProfileController.js");
const { getAssignments, addAssignment } = require("../data/matchingData.js");

// get volunteers
exports.getAllVolunteers = (req, res) => {
  const profiles = getUserProfiles();
  const volunteers = profiles.map(p => ({
    id: p.id,
    name: p.fullName,
    skills: p.skills,
    availability: p.availability,
    city: p.city
  }));
  res.json(volunteers);
};

// Get matched events for a volunteer
exports.getMatchedEvents = (req, res) => {
  const { volunteerId } = req.params;

  if (!volunteerId) {
    return res.status(400).json({ message: "Volunteer ID required" });
  }

  const profiles = getUserProfiles();
  const volunteer = profiles.find(p => p.id === parseInt(volunteerId));

  if (!volunteer) {
    return res.status(404).json({ message: "Volunteer not found" });
  }

  const events = getEvents();

  // logiv to match event based on skill and then availability
  const matchedEvents = events.filter(event => {
    const hasSkill = event.skillsRequired.some(skill => volunteer.skills.includes(skill));
    const isAvailable = volunteer.availability.includes(event.date);
    return hasSkill && isAvailable;
  });

  res.json(matchedEvents);
};

// Assign a volunteer to an event
exports.assignVolunteerToEvent = (req, res) => {
  const { volunteerId, eventId } = req.body;

  if (!volunteerId || !eventId) {
    return res.status(400).json({ message: "Volunteer ID and Event ID required" });
  }

  const profiles = getUserProfiles();
  const volunteer = profiles.find(p => p.id === parseInt(volunteerId));

  if (!volunteer) {
    return res.status(404).json({ message: "Volunteer not found" });
  }

  const events = getEvents();
  const event = events.find(e => e.id === parseInt(eventId));

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  // Check if already assigned
  const assignments = getAssignments();
  const alreadyAssigned = assignments.some(
    a => a.volunteerId === parseInt(volunteerId) && a.eventId === parseInt(eventId)
  );

  if (alreadyAssigned) {
    return res.status(400).json({ message: "Volunteer already assigned to this event" });
  }

  // Create assignment
  const assignment = {
    id: assignments.length + 1,
    volunteerId: parseInt(volunteerId),
    eventId: parseInt(eventId),
    volunteerName: volunteer.fullName,
    eventName: event.title,
    status: "Assigned"
  };

  // Save assignment
  addAssignment(assignment);
  res.status(201).json(assignment);
};

// get assignments
exports.getVolunteerAssignments = (req, res) => {
  const assignments = getAssignments();
  res.json(assignments);
};