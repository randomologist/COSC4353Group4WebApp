import React, { useState } from "react";
import "./EventManagement.css";

function EventManagement() {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    location: "",
    requiredSkills: [],
    urgency: "",
    eventDate: "",
  });

  const [errors, setErrors] = useState({});

  // Skill and Urgency Options
  const skillsOptions = ["Teaching / Tutoring", "Event Setup / Breakdown", "Cooking / Food Preparation", "Serving Food / Hospitality", "First Aid / CPR", "Childcare", "Elderly Care", "Driving / Transportation", "Fundraising", "Public Speaking", "Marketing / Outreach", "Social Media Management", "Administrative Support", "IT Support / Tech Help", "Language Translation", "Photography / Videography", "Music / Entertainment", "Gardening / Landscaping", "Cleaning / Sanitation", "Customer Service"];
  const urgencyOptions = ["Low", "Medium", "High"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, requiredSkills: selected });
  };

  // Setting requirements (char limit, empty fields, etc.)
  const validate = () => {
    let newErrors = {};
    if (!formData.eventName) newErrors.eventName = "An event name is required.";
    else if (formData.eventName.length > 100) newErrors.eventName = "Max 100 characters.";
    if (!formData.eventDescription) newErrors.eventDescription = "A description is required.";
    if (!formData.location) newErrors.location = "A location is required.";
    if (formData.requiredSkills.length === 0) newErrors.requiredSkills = "Select at least one skill.";
    if (!formData.urgency) newErrors.urgency = "Select an urgency level.";
    if (!formData.eventDate) newErrors.eventDate = "A date for the event is required.";
    return newErrors;
  };

  // Confirming submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Event Created:", formData);
      alert("Event created successfully!");
      setFormData({
        eventName: "",
        eventDescription: "",
        location: "",
        requiredSkills: [],
        urgency: "",
        eventDate: "",
      });
    }
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <h2>Event Management</h2>
        {/* Event Name */}
        <div>
          <label>Event Name</label><br />
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            maxLength={100}
            placeholder="Name of Event (Maximum of 100 characters)"
          />
          {errors.eventName && <p style={{ color: "red" }}>{errors.eventName}</p>}
        </div>

        {/* Event Description (using textarea just to be safe for descriptions)*/}
        <div>
          <label>Event Description</label><br />
          <textarea
            name="eventDescription"
            value={formData.eventDescription}
            onChange={handleChange}
            placeholder="Description of Event"
          />
          {errors.eventDescription && <p style={{ color: "red" }}>{errors.eventDescription}</p>}
        </div>
        
        {/* Location (using textarea just to be safe for long locations)*/}
        <div>
          <label>Location</label><br />
          <textarea
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Address of Event"
          />
          {errors.location && <p style={{ color: "red" }}>{errors.location}</p>}
        </div>

        {/* Required Skills */}
        <div>
          <label>Required Skills (Hold CTRL to select more than one)</label><br />
          <select multiple value={formData.requiredSkills} onChange={handleMultiSelect}>
            {skillsOptions.map((skill) => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
          {errors.requiredSkills && <p style={{ color: "red" }}>{errors.requiredSkills}</p>}
        </div>

        {/* Urgency */}
        <div>
          <label>Urgency</label><br />
          <select name="urgency" value={formData.urgency} onChange={handleChange}>
            <option value="">-- Select urgency --</option>
            {urgencyOptions.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          {errors.urgency && <p style={{ color: "red" }}>{errors.urgency}</p>}
        </div>

        {/* Event Date */}
        <div>
          <label>Event Date</label><br />
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
          />
          {errors.eventDate && <p style={{ color: "red" }}>{errors.eventDate}</p>}
        </div>

        <br />
        {/* Submission Button */}
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default EventManagement;
