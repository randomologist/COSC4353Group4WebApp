const express = require("express");
const { getVolunteerReport, getEventReport } = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/volunteers", authMiddleware, roleMiddleware("admin"), getVolunteerReport);
router.get("/events", authMiddleware, roleMiddleware("admin"), getEventReport);

module.exports = router;
