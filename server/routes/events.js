const express = require("express");
const router = express.Router();
const db = require("../db");
const { getAllEvents, createEvent } = require("../controllers/eventController");

router.get("/", getAllEvents);


router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM eventDetails WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Event not found" });

    row.requiredSkills = row.requiredSkills ? JSON.parse(row.requiredSkills) : [];
    res.json(row);
  });
});

router.post("/", createEvent);

// UPDATE event by ID
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const {
    eventName,
    description,
    location,
    requiredSkills,
    urgency,
    eventDate,
    startTime,
    endTime
  } = req.body;

  db.run(
    `UPDATE eventDetails
     SET eventName = ?, description = ?, location = ?, requiredSkills = ?, urgency = ?, eventDate = ?, startTime = ?, endTime = ?
     WHERE id = ?`,
    [
      eventName,
      description,
      location,
      JSON.stringify(requiredSkills || []),
      urgency,
      eventDate,
      startTime,
      endTime,
      id
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Event updated", id });
    }
  );
});

// DELETE event by ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM eventDetails WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Event deleted", id });
  });
});

module.exports = router;
