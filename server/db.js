const sqlite3 = require("sqlite3").verbose();

// Create or open a database file
const db = new sqlite3.Database("./volunteer_app.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS UserCredentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`
  );

  db.run(`
    CREATE TABLE IF NOT EXISTS UserProfile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      address1 TEXT NOT NULL,
      address2 TEXT,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      zipCode TEXT NOT NULL,
      skills TEXT NOT NULL,
      preferences TEXT,
      availability TEXT NOT NULL,
      userId INTEGER,
      FOREIGN KEY(userId) REFERENCES UserCredentials(id)
    )`);

  db.run(`
    CREATE TABLE IF NOT EXISTS EventDetails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventName TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      requiredSkills TEXT NOT NULL,
      urgency TEXT NOT NULL,
      eventDate TEXT NOT NULL
    )`);

  db.run(`
    CREATE TABLE IF NOT EXISTS VolunteerHistory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      eventId INTEGER NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY(userId) REFERENCES UserCredentials(id),
      FOREIGN KEY(eventId) REFERENCES EventDetails(id)
    )`);
});

module.exports = db;
