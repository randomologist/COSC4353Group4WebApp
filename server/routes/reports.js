const express = require("express");
const { getVolunteerReport, getEventReport } = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/volunteers", authMiddleware, getVolunteerReport);
router.get("/events", authMiddleware, getEventReport);

module.exports = router;
