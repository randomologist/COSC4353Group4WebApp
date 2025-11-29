const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  getAllVolunteers,
  getMatchedEvents,
  assignVolunteerToEvent,
  getVolunteerAssignments
} = require("../controllers/matchingController.js");

const router = express.Router();

router.get("/volunteers", authMiddleware, roleMiddleware("admin"), getAllVolunteers);
router.get("/matches/:volunteerId",authMiddleware, roleMiddleware("admin"), getMatchedEvents);
router.post("/assign", authMiddleware, roleMiddleware("admin"), assignVolunteerToEvent);
router.get("/assignments", authMiddleware, roleMiddleware("admin"), getVolunteerAssignments);

module.exports = router;