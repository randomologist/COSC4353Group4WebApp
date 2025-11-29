const { addAssignment:dbAddAssginment } = require("../repositories/matchingRepo")

//example assignment on backend
/*
  id: assignments.length + 1,
  volunteerId: parseInt(volunteerId),
  eventId: parseInt(eventId),
  volunteerName: volunteer.fullName,
  eventName: event.eventName,//pulled from eventData in matching controller
  status: "Assigned"
*/

let assignments = [];

exports.getAssignments = async() => assignments;

exports.resetAssignments = async(data) => { 
  assignments = data; 
};

exports.addAssignment = async(assignment) => {
  let assignmentToDB = { 
    userId: assignment.volunteerId,
    eventId: assignment.eventId, 
    status: assignment.status 
  }
  await dbAddAssginment(assignmentToDB)
  assignments.push(assignment);
};
