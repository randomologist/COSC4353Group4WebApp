let assignments = [];

exports.getAssignments = () => assignments;

exports.resetAssignments = (data) => { 
  assignments = data; 
};

exports.addAssignment = (assignment) => {
  assignments.push(assignment);
};
