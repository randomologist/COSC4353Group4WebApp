const db = require('../db');

function getEvents(){
  return new Promise((resolve, reject) =>{
    db.all("SELECT * FROM eventDetails ORDER BY id", [], (err,rows) =>{
      if(err){return reject(err);}
      const parsed = rows.map(ev =>({
        ...ev,
        requiredSkills: ev.requiredSkills ? JSON.parse(ev.requiredSkills) : []
      }));
      resolve(parsed);
    });
  })
};

function addEvent(event){
  return new Promise((resolve,reject) =>{
    db.run(
      `INSERT INTO eventDetails (eventName, description, location, requiredSkills, urgency, eventDate, startTime, endTime)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event.eventName,
        event.description,
        event.location,
        JSON.stringify(event.requiredSkills),
        event.urgency,
        event.eventDate,
        event.startTime,
        event.endTime
      ],
      function(err){
        if(err){return reject(err);}
        resolve({ id: this.lastID, ...event });
      }
    )
  })
};

module.exports = {getEvents, addEvent};