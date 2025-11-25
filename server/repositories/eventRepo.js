const db = require('../db');

function addEvent(event) {
    const { 
        eventName,
        location,
        eventDate,
        startTime,
        endTime,
        requiredSkills = [],
        urgency = "Normal",
        description = "" 
    } = event
    return new Promise((resolve, reject) => {
        db.run(
        `INSERT INTO UserCredentials (eventName, description, location, requ) VALUES (?, ?)`,
       `
      eventName TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      requiredSkills TEXT NOT NULL,
      urgency TEXT NOT NULL,
      eventDate TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL)`
        [email, passwordHash],
        function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID, email, role });
        }
        );
    });
}