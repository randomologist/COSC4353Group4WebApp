const db = require('../db');

function findByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id, email, password AS passwordHash, 'volunteer' AS role
       FROM UserCredentials WHERE LOWER(email)=LOWER(?)`,
      [email],
      (err, row) => (err ? reject(err) : resolve(row || null))
    );
  });
}

function create({ email, passwordHash, role = 'volunteer' }) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO UserCredentials (email, password) VALUES (?, ?)`,
      [email, passwordHash],
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
    db.run(`DELETE FROM UserCredentials`, [], (err) => (err ? reject(err) : resolve()));
  });
}

module.exports = { findByEmail, create, _truncate };