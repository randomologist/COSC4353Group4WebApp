import { useState } from "react";
import "./UserProfile.css"; 

function ProfilePage() {
  const [userData, setUserData] = useState({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    skills: [],
    preferences: "",
    availability: []
  });

  /* updates current form values */
  /* had to look this up */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  /* prevents page refresh etc. */
  /* had to look this up */
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", userData);
  };

  // handle date changes 
  const handleDateChange = (index, value) => {
    const newAvailability = [...userData.availability];
    newAvailability[index] = value;
    setUserData((prev) => ({
      ...prev,
      availability: newAvailability
    }));
  };

  // removes date field 
  const handleRemoveDate = (index) => {
    setUserData((prev) => {
      const updated = [...prev.availability];
      updated.splice(index, 1);
      return { ...prev, availability: updated };
    });
  };


  // adds new date
  const addDateField = () => {
    setUserData((prev) => ({
      ...prev,
      availability: [...prev.availability, ""]
    }));
  };

  return (
    <div className="form"> {/* center said form in screen*/}
      <form onSubmit={handleSubmit}>
        <h1>User Profile</h1>
        
        {/*Name */}
        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={userData.fullName}
            maxLength={50}
            onChange={handleChange}
            required
            placeholder="First Last"
          />
        </label>
        
        {/* Address line 1*/}
        <label>
          Address 1:
          <input
            type="text"
            name="address1"
            value={userData.address1}
            maxLength={100}
            onChange={handleChange}
            placeholder="1234 Main St"
            required
          />
        </label>
        
        {/* Address line 2*/}
        <label>
          Address 2:
          <input
            type="text"
            name="address2"
            value={userData.address2}
            maxLength={100}
            onChange={handleChange}
            placeholder= "Apt #, suite, etc. (optional)" 
            />
        </label>
        
        {/*City*/}
        <label>
          City:
          <input
            type="text"
            name="city"
            value={userData.city}
            onChange={handleChange}
            required
            maxLength={100}
            placeholder="City"
          />
        </label>
        
        {/* State*/}
        <label>
          State:
          <select
            name="state"
            value={userData.state}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="AL">AL</option>
            <option value="AK">AK</option>
            <option value="AZ">AZ</option>
            <option value="AR">AR</option>
            <option value="CA">CA</option>
            <option value="CO">CO</option>
            <option value="CT">CT</option>
            <option value="DE">DE</option>
            <option value="FL">FL</option>
            <option value="GA">GA</option>
            <option value="HI">HI</option>
            <option value="ID">ID</option>
            <option value="IL">IL</option>
            <option value="IN">IN</option>
            <option value="IA">IA</option>
            <option value="KS">KS</option>
            <option value="KY">KY</option>
            <option value="LA">LA</option>
            <option value="ME">ME</option>
            <option value="MD">MD</option>
            <option value="MA">MA</option>
            <option value="MI">MI</option>
            <option value="MN">MN</option>
            <option value="MS">MS</option>
            <option value="MO">MO</option>
            <option value="MT">MT</option>
            <option value="NE">NE</option>
            <option value="NV">NV</option>
            <option value="NH">NH</option>
            <option value="NJ">NJ</option>
            <option value="NM">NM</option>
            <option value="NY">NY</option>
            <option value="NC">NC</option>
            <option value="ND">ND</option>
            <option value="OH">OH</option>
            <option value="OK">OK</option>
            <option value="OR">OR</option>
            <option value="PA">PA</option>
            <option value="RI">RI</option>
            <option value="SC">SC</option>
            <option value="SD">SD</option>
            <option value="TN">TN</option>
            <option value="TX">TX</option>
            <option value="UT">UT</option>
            <option value="VT">VT</option>
            <option value="VA">VA</option>
            <option value="WA">WA</option>
            <option value="WV">WV</option>
            <option value="WI">WI</option>
            <option value="WY">WY</option>
          </select>
        </label>
        
        {/* Zip Code*/}
        <label>
          Zip Code:
          <input
            type="text"
            name="zipCode"
            value={userData.zipCode}
            maxLength={9}
            minLength={5}
            onChange={handleChange}
            placeholder="12345 or 12345-6789"
            required/>
        </label>
        
        {/* Skills */}
        <label>
          Skills (Hold CTRL to select more than one):
          <select
            name="skills"
            multiple
            required
            value={userData.skills}
            onChange={(e) => {
              const selected = Array.from(
                e.target.selectedOptions, // HTMLCollection → array
                (option) => option.value
              );
              setUserData((prev) => ({
                ...prev,
                skills: selected
              }));
            }}>
            <option value="teaching">Teaching / Tutoring</option>
            <option value="event-setup">Event Setup / Breakdown</option>
            <option value="cooking">Cooking / Food Preparation</option>
            <option value="serving">Serving Food / Hospitality</option>
            <option value="first-aid">First Aid / CPR</option>
            <option value="childcare">Childcare</option>
            <option value="elderly-care">Elderly Care</option>
            <option value="driving">Driving / Transportation</option>
            <option value="fundraising">Fundraising</option>
            <option value="public-speaking">Public Speaking</option>
            <option value="marketing">Marketing / Outreach</option>
            <option value="social-media">Social Media Management</option>
            <option value="admin">Administrative Support</option>
            <option value="it-support">IT Support / Tech Help</option>
            <option value="translation">Language Translation</option>
            <option value="photography">Photography / Videography</option>
            <option value="music">Music / Entertainment</option>
            <option value="gardening">Gardening / Landscaping</option>
            <option value="cleaning">Cleaning / Sanitation</option>
            <option value="customer-service">Customer Service</option>
          </select>
        </label>

        {/*Event Preferences */}
        <label>
          Event Preferences:
          <textarea
            name="preferences"
            value={userData.preferences}
            onChange={handleChange}/>
        </label>

        {/*date Avaiabilty*/}
         {/* Had some help with multiple date selection */}
        <div>
          <label>Availability (Select Multiple Dates):</label>
          {userData.availability.map((date, index) => (
            <div key={index} style={{ marginBottom: "8px" }}>
              <input
                type="date"
                value={date}
                onChange={(e) => handleDateChange(index, e.target.value)}
              />
              {/* Button to remove date*/}
              <button 
                type="button"
                className="sub_button"
                onClick={() => handleRemoveDate(index)}
              >
                Remove Date
              </button>
            </div>
          ))}
          {/* Button to add dates*/}
          <button type="button" className = "sub_button" 
          onClick={addDateField}>
            Add Date
          </button>
        </div>
        
        {/* Button to save profile*/}
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default ProfilePage;