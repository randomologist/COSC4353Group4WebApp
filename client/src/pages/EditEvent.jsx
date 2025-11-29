import { useEffect, useState } from "react";

const EditEvent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [formData, setFormData] = useState({
    eventName: "",
    location: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    requiredSkills: [],
    urgency: "Normal",
    description: "",
  });

  const token = localStorage.getItem("token");

  // Load all events for dropdown
  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  // Load event details when selected
  useEffect(() => {
    if (!selectedEventId) return;

    fetch(`/api/events/${selectedEventId}`)
      .then((res) => res.json())
      .then((data) => setFormData(data));

  }, [selectedEventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Save edits
  const handleSave = async () => {
    const response = await fetch(`/api/events/${selectedEventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Event updated successfully!");
    } else {
      alert("Failed to update event.");
    }
  };

  // DELETE event
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    const response = await fetch(`/api/events/${selectedEventId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Event deleted!");
      setSelectedEventId("");
      setFormData({
        eventName: "",
        location: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        requiredSkills: [],
        urgency: "Normal",
        description: "",
      });
      // Reload events
      fetch("/api/events")
        .then((res) => res.json())
        .then((data) => setEvents(data));
    } else {
      alert("Failed to delete event.");
    }
  };

  return (
    <div className="create-event-container">
      <h2>Edit Event</h2>

      <label>Select an Event</label>
      <select
        value={selectedEventId}
        onChange={(e) => setSelectedEventId(e.target.value)}
      >
        <option value="">-- Select Event --</option>
        {events.map((e) => (
          <option key={e.id} value={e.id}>
            {e.eventName}
          </option>
        ))}
      </select>

      {selectedEventId && (
        <>
          <label>Event Name</label>
          <input
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
          />

          <label>Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          <label>Date</label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
          />

          <label>Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
          />

          <label>End Time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
          />

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>

          <button className="delete-btn" onClick={handleDelete}>
            Delete Event
          </button>
        </>
      )}
    </div>
  );
};

export default EditEvent;
