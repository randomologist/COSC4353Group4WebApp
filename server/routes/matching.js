const express = require("express");
const {
  getAllVolunteers,
  getMatchedEvents,
  assignVolunteerToEvent,
  getVolunteerAssignments
} = require("../controllers/matchingController.js");

const router = express.Router();

router.get("/volunteers", getAllVolunteers);
router.get("/matches/:volunteerId", getMatchedEvents);
router.post("/assign", assignVolunteerToEvent);
router.get("/assignments", getVolunteerAssignments);

module.exports = router;