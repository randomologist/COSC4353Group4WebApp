const db = require('../db');

async function addAssignment(assignment){
  return new Promise((resolve,reject) =>{
    db.run(
      `INSERT INTO VolunteerHistory (userId, eventId, status)
      VALUES (?, ?, ?)`,
      [
        assignment.userId,
        assignment.eventId,
        assignment.status
      ],
      function(err){
        if(err){return reject(err);}
        resolve({ id: this.lastID, ...assignment });
      }
    )
  })
};

module.exports = {addAssignment};
