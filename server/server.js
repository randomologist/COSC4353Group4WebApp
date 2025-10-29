const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db.js"); // database import
const PORT = 5000;

app.use(cors());
app.use(express.json());

const userProfileRoutes = require("./routes/userProfile");
const eventRoutes = require("./routes/events");
const matchingRoutes = require("./routes/matching");
const authRoutes = require("./routes/auth");
const notifRoutes = require("./routes/notifs")

app.use("/api/userProfile", userProfileRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notifs",notifRoutes);

if (process.env.NODE_ENV === "test") { // for test node_env auto == test
  module.exports = app;
} else {
  app.listen(5000, () => console.log("Server running"));
}

// valdiations for new user
app.post("/api/users", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  db.run("INSERT INTO UserCredentials (username, password) VALUES (?, ?)", [username, password], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "User created successfully." });
  });
});

// valdiations for new event
app.post("/api/events", (req, res) => {
  const { name, description, location, requiredSkills, urgency, eventDate } = req.body;

  if (!name || !description || !location || !urgency || !eventDate) {
    return res.status(400).json({ error: "All event fields are required." });
  }

  db.run(
    `INSERT INTO EventDetails (name, description, location, requiredSkills, urgency, eventDate)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, location, requiredSkills, urgency, eventDate],
    function (err) {
      if (err) return res.status(500).json({ error: "Failed to create event." });
      res.status(201).json({ message: "Event created!", id: this.lastID });
    }
  );
});

// user profile validaiton ;P
app.post("/api/profile", (req, res) => {
  const {
    fullName,
    address,
    city,
    state,
    zipcode,
    skills,
    preferences,
    availability
  } = req.body;

  if (!fullName || !address || !city || !state || !zipcode) {
    return res.status(400).json({ error: "All address fields are required." });
  }

  if (!/^\d{5}$/.test(zipcode)) {
    return res.status(400).json({ error: "Zip code must be 5 digits." });
  }

  db.run(
    `INSERT INTO UserProfile (fullName, address, city, state, zipcode, skills, preferences, availability)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      fullName,
      address,
      city,
      state,
      zipcode,
      JSON.stringify(skills || []),
      preferences || "",
      JSON.stringify(availability || [])
    ],
    function (err) {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Failed to save profile." });
      }
      res.status(201).json({ message: "Profile saved successfully!", id: this.lastID });
    }
  );
});


// get evetns
app.get("/api/events", (req, res) => {
  db.all(`SELECT * FROM EventDetails`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch events." });
    res.json(rows);
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));