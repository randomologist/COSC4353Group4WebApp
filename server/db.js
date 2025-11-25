const sqlite3 = require("sqlite3").verbose();

const isTest = process.env.NODE_ENV === "test";
const DB_PATH = isTest ? ":memory:" : "./volunteer_app.db"; // For fast testing in Vitest

// Create or open a database file
const db = new sqlite3.Database(DB_PATH, (err) => {
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
      password TEXT NOT NULL,
      role TEXT)`
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
      FOREIGN KEY(userId) REFERENCES UserCredentials(id))`
    );

  db.run(`
    CREATE TABLE IF NOT EXISTS EventDetails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventName TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      requiredSkills TEXT NOT NULL,
      urgency TEXT NOT NULL,
      eventDate TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL)`
    );

  db.run(`
    CREATE TABLE IF NOT EXISTS VolunteerHistory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      eventId INTEGER NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY(userId) REFERENCES UserCredentials(id),
      FOREIGN KEY(eventId) REFERENCES EventDetails(id))`
    );

  db.run(`
    CREATE TABLE IF NOT EXISTS Notifs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eventID INTEGER,
    message TEXT NOT NULL,
    details TEXT NOT NULL,
    read BOOLEAN NOT NULL,
    FOREIGN KEY (eventID) REFERENCES EventDetails(id))`
  );
  //Add new startTime and endTime columns to eventDetails if they don't exist
  db.all(`PRAGMA table_info(EventDetails);`, (err, rows) => {
    if (err) {
      console.error("Error checking EventDetails schema:", err.message);
      return;
    }

    const columns = rows.map(r => r.name);
    if (!columns.includes("startTime")) {
      db.run(`ALTER TABLE EventDetails ADD COLUMN startTime TEXT;`);
      console.log("Added startTime column to EventDetails");
    }
    if (!columns.includes("endTime")) {
      db.run(`ALTER TABLE EventDetails ADD COLUMN endTime TEXT;`);
      console.log("Added endTime column to EventDetails");
    }
  });
  // Ensure UserCredentials schema has a 'role' column
  db.all(`PRAGMA table_info(UserCredentials);`, (err, rows) => {
    if (err) {
      console.error("Error checking UserCredentials schema:", err.message);
      return;
    }

    const columns = rows.map(r => r.name);

    if (!columns.includes("role")) {
      db.run(`ALTER TABLE UserCredentials ADD COLUMN role TEXT;`, err => {
        if (err) {
          console.error("Failed to add role column:", err.message);
        } else {
          console.log("Added role column to UserCredentials");
          // Optional: backfill legacy rows with a default role
          db.run(`UPDATE UserCredentials SET role = 'user' WHERE role IS NULL;`, err2 => {
            if (err2) {
              console.error("Failed to backfill role:", err2.message);
            } else {
              console.log("Backfilled role column with default 'user'");
            }
          });
        }
      });
    }
  });
})
module.exports = db;
