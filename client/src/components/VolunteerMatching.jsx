import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import "./VolunteerMatching.css"

function VolunteerMatching() {
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [matchedEvents, setMatchedEvents] = useState([]);
  const [hasMatched, setHasMatched] = useState(false);
  const { token, user } = useAuth();
  
  // loading volunteers and events 
  useEffect(() => {
    fetch("http://localhost:5000/api/matching/volunteers", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        })
      .then(res => res.json())
      .then(data => setVolunteers(data))
      .catch(err => console.error("Error loading volunteers:", err));

    fetch("http://localhost:5000/api/events", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        })
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Error loading events:", err));
  }, []);
  useEffect(() => {
    console.log(events)
  }, [events]);
  const handleMatch = async () => {
    if (!selectedVolunteer) {
      alert("Please select a volunteer first.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/matching/matches/${selectedVolunteer}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
      const matches = await res.json();
      setMatchedEvents(matches);
      setHasMatched(true);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const handleAssign = async (eventId) => {
    try {
      const res = await fetch("http://localhost:5000/api/matching/assign", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" ,
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          volunteerId: parseInt(selectedVolunteer),
          eventId: eventId
        })
      });

      if (res.ok) {
        alert("Volunteer assigned to event!");
      } else {
        const error = await res.json();
        alert("Error: " + error.message);
      }
    } catch (error) {
      console.error("Error assigning volunteer:", error);
    }
  };

  return (
    <div className="volunteer-matching">
      <h2>Volunteer Matching</h2>

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
      <button onClick={handleMatch}>Find Matches</button>

      {matchedEvents.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Matched Events:</h3>
          <ul>
            {matchedEvents.map((event) => (
              <li key={event.id} style={{color: 'black'}}>
                <strong>{event.eventName}</strong> (Requires: {event.requiredSkills.join(", ")})
                <button onClick={() => handleAssign(event.id)}>Assign</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasMatched && matchedEvents.length === 0 && (
        <p style={{ marginTop: "20px", color: "red" }}>
          No matching events found for this volunteer.
        </p>
      )}
    </div>
  );
}

export default VolunteerMatching;