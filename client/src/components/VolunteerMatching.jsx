import React, { useState } from "react";
import "./VolunteerMatching.css"

function VolunteerMatching() {
  // Placeholder volunteers and events (simulating back end for now)
  const volunteers = [
    { id: 1, name: "Kelly Johnson", skills: ["First Aid / CPR", "Teaching / Tutoring"] },
    { id: 2, name: "Bob Smith", skills: ["Cooking / Food Preparation", "Driving / Transportation"] },
    { id: 3, name: "John Doe", skills: ["Cleaning / Sanitation", "First Aid / CPR"] },
    { id: 4, name: "Dylan Lee", skills: ["Fundraising", "Public Speaking"] }
  ];

  const events = [
    {
      id: 101,
      name: "Community Health Fair",
      requiredSkills: ["First Aid / CPR"],
    },
    {
      id: 102,
      name: "Soup Kitchen",
      requiredSkills: ["Cooking / Food Preparation"],
    },
    {
      id: 103,
      name: "Neighborhood Clean-Up",
      requiredSkills: ["Cleaning / Sanitation"],
    },
  ];

  // Using these to not show the "No match found" before clicking "Find Matches"
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [matchedEvents, setMatchedEvents] = useState([]);
  const [hasMatched, setHasMatched] = useState(false);

  const handleMatch = () => {
    // Pressing "Find Matches" before selecting
    if (!selectedVolunteer) {
      alert("Please select a volunteer first.");
      return;
    }
    setHasMatched(true);

    const volunteer = volunteers.find((v) => v.id === parseInt(selectedVolunteer));
    if (!volunteer) return;

    // Match based on at least one matching skill
    const matches = events.filter((event) =>
      event.requiredSkills.some((skill) => volunteer.skills.includes(skill))
    );

    setMatchedEvents(matches);
  };

  return (
    <div className="volunteer-matching">
      <h2>Volunteer Matching</h2>

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
      <button onClick={handleMatch}>Find Matches</button>

      {/* Results */}
      {matchedEvents.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Matched Events:</h3>
          <ul>
            {matchedEvents.map((event) => (
              <li key={event.id} style={{color: 'black'}}>
                <strong>{event.name}</strong> (Requires: {event.requiredSkills.join(", ")})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* If no match found */}
      {hasMatched && matchedEvents.length === 0 && (
        <p style={{ marginTop: "20px", color: "red" }}>
          No matching events found for this volunteer.
        </p>
      )}
    </div>
  );
}

export default VolunteerMatching;
