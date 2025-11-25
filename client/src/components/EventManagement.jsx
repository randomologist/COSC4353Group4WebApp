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
    startTime:"",
    endTime:""
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
    <div className="formWrapper">
      <form onSubmit={handleSubmit}>
        <h2>Event Management</h2>
        {/* Event Name */}
        <div>
          <label htmlFor = "eventName">Event Name</label>
          <input
            type="text"
            name="eventName"
            id = "eventName"
            value={formData.eventName}
            onChange={handleChange}
            maxLength={100}
            placeholder="Name of Event (Maximum of 100 characters)"
          />
          {errors.eventName && <p style={{ color: "red" }}>{errors.eventName}</p>}
        </div>

        {/* Event Description (using textarea just to be safe for descriptions)*/}
        <div>
          <label htmlFor = "eventDescription">Event Description</label>
          <textarea
            name="eventDescription"
            id = "eventDescription"
            value={formData.eventDescription}
            onChange={handleChange}
            placeholder="Description of Event"
          />
          {errors.eventDescription && <p style={{ color: "red" }}>{errors.eventDescription}</p>}
        </div>
        
        {/* Location (using textarea just to be safe for long locations)*/}
        <div>
          <label htmlFor = "location">Location</label>
          <textarea
            name="location"
            id = "location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Address of Event"
          />
          {errors.location && <p style={{ color: "red" }}>{errors.location}</p>}
        </div>

        {/* Required Skills */}
        <div>
          <label htmlFor = "requiredSkills">Required Skills (Hold CTRL to select more than one)</label>
          <select id = "requiredSkills" multiple value={formData.requiredSkills} onChange={handleMultiSelect}>
            {skillsOptions.map((skill) => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
          {errors.requiredSkills && <p style={{ color: "red" }}>{errors.requiredSkills}</p>}
        </div>

        {/* Urgency */}
        <div>
          <label htmlFor = "urgency">Urgency</label>
          <select name="urgency" id = "urgency" value={formData.urgency} onChange={handleChange}>
            <option value="">-- Select urgency --</option>
            {urgencyOptions.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          {errors.urgency && <p style={{ color: "red" }}>{errors.urgency}</p>}
        </div>

        {/* Event Date */}
        <div>
          <label htmlFor = "eventDate">Event Date</label>
          <input
            type="date"
            name="eventDate"
            id = "eventDate"
            value={formData.eventDate}
            onChange={handleChange}
          />
          {errors.eventDate && <p style={{ color: "red" }}>{errors.eventDate}</p>}
        </div>
        {/* Event Time*/}
        <div className="time-selector">
            <div className = "time-selector-sub">
              <label htmlFor = "startTime">Event Start Time</label>
              <input type="time" name="startTime"  id = "startTime"value={formData.startTime} onChange={handleChange} />
            </div>
            <div className = "time-selector-sub">
              <label htmlFor = "endTime">Event End Time</label>
              <input type="time" name="endTime"  id="endTime"value={formData.endTime} onChange={handleChange} />
            </div>
        </div>
        <br />
        {/* Submission Button */}
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default EventManagement;
