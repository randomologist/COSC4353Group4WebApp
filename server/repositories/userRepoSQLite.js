const db = require('../db');

function findByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id, email, password AS passwordHash, role
       FROM UserCredentials WHERE LOWER(email)=LOWER(?)`,
      [email],
      (err, row) => (err ? reject(err) : resolve(row || null))
    );
  });
}

function create({ email, passwordHash, role }) {
  return new Promise((resolve, reject) => {
    const safeRole = role || "user";
    db.run(
      `INSERT INTO UserCredentials (email, password,role) VALUES (?, ?, ?)`,
      [email, passwordHash,safeRole],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, email, role });
      }
    );
  });
}

// Tests can clear the table between runs
function _truncate() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`DELETE FROM UserCredentials`, [], (err) => {
        if (err) return reject(err);
        db.run(`DELETE FROM sqlite_sequence WHERE name = ?`, ['UserCredentials'], (err2) => {
          if (err2) return reject(err2);
          resolve();
        });
      });
    });
  });
}

module.exports = { findByEmail, create, _truncate };