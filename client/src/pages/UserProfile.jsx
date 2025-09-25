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

  /* had to look this up */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  /* had to look this up */
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", userData);
  };

  return (
    <div className="form"> {/* center said form */}
      <form onSubmit={handleSubmit}>
        <h1>User Profile</h1>
        
        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={userData.fullName}
            onChange={handleChange}
            required
          />
        </label>
        
        <label>
          Address 1:
          <input
            type="text"
            name="address1"
            value={userData.address1}
            onChange={handleChange}
            required
          />
        </label>
        
        <label>
          Address 2:
          <input
            type="text"
            name="address2"
            value={userData.address2}
            onChange={handleChange}
          />
        </label>
        
        <label>
          City:
          <input
            type="text"
            name="city"
            value={userData.city}
            onChange={handleChange}
            required
          />
        </label>
        
        <label>
          State:
          <select
            name="state"
            value={userData.state}
            onChange={handleChange}
            required
          >
            <option value="">Select State</option>
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
        
        <label>
          Zip Code:
          <input
            type="text"
            name="zip"
            value={userData.zip}
            onChange={handleChange}
            required/>
        </label>
        
        <label>
          Preferences:
          <textarea
            name="preferences"
            value={userData.preferences}
            onChange={handleChange}/>
        </label>

        <label>
          Availabilty:
          <input
            type="date"
            name="availability"
            value={userData.availability}
            onChange={handleChange}
            required
          />
        </label>
        
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default ProfilePage;