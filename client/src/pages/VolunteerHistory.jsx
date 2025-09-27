import React, { useState } from "react";
import "./VolunteerHistory.css"

function VolunteerHistory() {
  // Placeholders for volunteers and events
  const volunteers = [
    { id: 1, name: "Rick James", history:[15,17,21]},
    { id: 2, name: "Jill Smith", history:[15,18]},
    { id: 3, name: "Felix Johnson", history:[21,23]},
    { id: 4, name: "Bob Williams", history:[15]},
    { id: 5, name: "Alice Brown", history:[]},
  ];
//placeholder events
  const events = [
    {
      id: 15,
      name: "Park Clean-up",
      date: "07/04/2023",
    },
    {
      id: 17,
      name: "Meal Kit Distribution",
      date: "08/15/2023",
    },
    {
      id: 18,
      name: "Community Garden Help",
      date: "09/10/2023",
    },
    {
        id: 21,
        name: "Toy Drive Assistance",
        date: "11/20/2023",
    },
    {
        id:23,
        name: "Library Reading Program",
        date: "12/05/2023",
    }

  ];

 
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [volunteerHist, setVolunteerHist] = useState([]);
  const [hasHist, setHasHist] = useState(false);

  const handleHist = () => {
    const volunteer = volunteers.find((v) => v.id === parseInt(selectedVolunteer));
    // Pressing "Get Volunteering Hisotry" before selecting
    if (!volunteer) {
      alert("Please select a volunteer first.");
      return;
    }
    setHasHist(true);

    const history = volunteer.history.map((eventID) =>{
      const event = events.find((e) => e.id === eventID);
      return{
        id: event.id,
        name: event.name,
        date: event.date
      };
    });

    setVolunteerHist(history);
  };

  return (
    <div className="volunteer-history">
      <h2>Volunteer History</h2>

      {/* Select Volunteer */}
      <div>
        <label>Select Volunteer</label><br />
        <select
          value={selectedVolunteer}
          onChange={(e) => setSelectedVolunteer(e.target.value)}
        >
          <option value="">-- Select a Volunteer --</option>
          {volunteers.map((vol) => (
            <option key={vol.id} value={vol.id}>
              {vol.name}
            </option>
          ))}
        </select>
      </div>

      <br />
      <button onClick={handleHist}>Get Volunteer History</button>

      {/* Results */}
      {volunteerHist.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Volunteer History:</h3>
          <ul>
            {volunteerHist.map((event) => (
              <li key={event.id} style={{color: 'black'}}>
                <strong>{event.name}</strong> - {event.date}
                 <a href={`/events/${notif.eventID}`}>View Event</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* If no history exists */}
      {hasHist && matchedEvents.length === 0 && (
        <p style={{ marginTop: "20px", color: "red" }}>
          No matching events found for this volunteer.
        </p>
      )}
    </div>
  );
}

export default VolunteerHistory;
