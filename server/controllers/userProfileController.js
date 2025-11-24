const db = require("../db");

// Keep mock data for testing
let userProfiles = [
  {
    id: 1,
    fullName: "John Doe",
    address1: "123 Main St",
    address2: "Apt 4B",
    city: "Houston",
    state: "TX",
    zipCode: "77001",
    skills: ["Organization", "Communication"],
    preferences: "Prefer weekend events",
    availability: ["2025-10-20", "2025-10-27"]
  },
  {
    id: 2,
    fullName: "Jane Smith",
    address1: "456 Oak Ave",
    address2: "",
    city: "Houston",
    state: "TX",
    zipCode: "77002",
    skills: ["Teaching"],
    preferences: "Morning shifts preferred",
    availability: ["2025-10-21"]
  }
];

// Check if we're in test mode
const isTestMode = process.env.NODE_ENV === "test";
const validateProfile = (profile) => {
  const { fullName, address1, city, state, zipCode, skills, availability } = profile;

  if (!fullName || !fullName.trim()) return "Full Name is required";
  if (!address1 || !address1.trim()) return "Address 1 is required";
  if (!city || !city.trim()) return "City is required";
  if (!state || state.length !== 2) return "State must be 2 characters";
  if (!zipCode || !/^\d{5}(-\d{4})?$/.test(zipCode)) return "Zip Code must be 5-9 digits";
  if (!Array.isArray(skills) || skills.length === 0) return "At least one skill required";
  if (!Array.isArray(availability) || availability.length === 0) return "At least one date required";

  return null;
};

// Create user profile
exports.createUserProfile = (req, res) => {
  const { fullName, address1, address2, city, state, zipCode, skills, preferences, availability, userId:bodyUID } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  const targUID = userRole === "admin" && bodyUID? bodyUID : userId;

  const error = validateProfile({ fullName, address1, city, state, zipCode, skills, availability });
  if (error) return res.status(400).json({ message: error });

  if (isTestMode) {
    // use mock
    const newProfile = {
      id: userProfiles.length + 1,
      fullName,
      address1,
      address2,
      city,
      state,
      zipCode,
      skills,
      preferences,
      availability,
      userId: targUID
    };
    userProfiles.push(newProfile);
    return res.status(201).json({ message: "Profile created successfully", id: newProfile.id });
  }

  // Use real database in production
  const sql = `
    INSERT INTO UserProfile (fullName, address1, address2, city, state, zip, skills, preferences, availability, userId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [
    fullName,
    address1 || null,
    address2 || null,
    city,
    state,
    zipCode, // Database column is 'zip' but we accept 'zipCode' from frontend
    JSON.stringify(skills),
    preferences || null,
    JSON.stringify(availability),
    targUID
  ], function(err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Failed to create profile" });
    }
    
    res.status(201).json({ 
      message: "Profile created successfully", 
      id: this.lastID,
      userId:targUID,
      fullName,
      address1,
      address2,
      city,
      state,
      zipCode,
      skills,
      preferences,
      availability
    });
  });
};

// Get user profile by ID
exports.getUserProfile = (req, res) => {
  const { userId } = req.params;
  const {id, role} = req.user;
  if (!userId) return res.status(400).json({ message: "User ID is required" });
  if (role !== "admin" && userId !== id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (isTestMode) {
    // Use mock data in test mode
    const profile = userProfiles.find(p => p.id === parseInt(userId));
    if (!profile) return res.status(404).json({ message: "User profile not found" });
    return res.json(profile);
  }

  // Use real database in production
  db.get(`SELECT * FROM UserProfile WHERE userId = ?`, [userId], (err, row) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Failed to fetch profile" });
    }
    
    if (!row) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Convert database format to frontend format
    const profile = {
      ...row,
      zipCode: row.zip, // Convert 'zip' to 'zipCode' for frontend
      skills: JSON.parse(row.skills || '[]'),
      availability: JSON.parse(row.availability || '[]')
    };

    res.json(profile);
  });
};

exports.getMyProfile = (req,res) =>{
  const userId = req.user.id
  const sql = `SELECT * FROM userProfile WHERE userId=?`;
  db.get(sql, [userId], (err,row) =>{
    if(err){
      console.error("Database error:", err);
      return res.status(500).json({ message: "Failed to fetch profile" });
    }
    if(!row){
      return res.status(404).json({ message: "No profile found for this user" });
    }
     const profile = {
      ...row,
      zipCode: row.zip, // Convert 'zip' to 'zipCode' for frontend
      skills: JSON.parse(row.skills || '[]'),
      availability: JSON.parse(row.availability || '[]')
    };

    res.json(profile);
  });
};

// Update user profile
exports.updateUserProfile = (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: "User ID is required" });

  const { id, role } = req.user;
  if (role !== "admin" && parseInt(userId) !== id) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const { fullName, address1, address2, city, state, zipCode, skills, preferences, availability } = req.body;

  const error = validateProfile({ fullName, address1, city, state, zipCode, skills, availability });
  if (error) return res.status(400).json({ message: error });
/*
  if (isTestMode) {
    // Use mock data in test mode
    console.log("testmode");
    const profileIndex = userProfiles.findIndex(p => p.id === parseInt(userId));
    if (profileIndex === -1) return res.status(404).json({ message: "User profile not found" });

    const updatedProfile = { ...req.body, id: parseInt(userId) };
    userProfiles[profileIndex] = updatedProfile;
    return res.json(updatedProfile);
  }*/

  // Use real database in production
  const sql = `
    UPDATE UserProfile 
    SET fullName = ?, address1 = ?, address2 = ?, city = ?, state = ?, 
        zip = ?, skills = ?, preferences = ?, availability = ?
    WHERE userId = ?
  `;

  db.run(sql, [
    fullName,
    address1,
    address2 || null,
    city,
    state,
    zipCode,
    JSON.stringify(skills),
    preferences || null,
    JSON.stringify(availability),
    userId
  ], function(err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Failed to update profile" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "User profile not found!" });
    }

    res.json({userId: parseInt(userId),
      fullName,
      address1,
      address2,
      city,
      state,
      zipCode,
      skills,
      preferences,
      availability});
  });
};

// Helpers for testing
exports.getUserProfiles = () => userProfiles;
exports.resetUserProfiles = (data) => { userProfiles = data; };

/*
// mock data
let userProfiles = [
  {
    id: 1,
    fullName: "John Doe",
    address1: "123 Main St",
    address2: "Apt 4B",
    city: "Houston",
    state: "TX",
    zipCode: "77001",
    skills: ["Organization", "Communication"],
    preferences: "Prefer weekend events",
    availability: ["2025-10-20", "2025-10-27"]
  },
  {
    id: 2,
    fullName: "Jane Smith",
    address1: "456 Oak Ave",
    address2: "",
    city: "Houston",
    state: "TX",
    zipCode: "77002",
    skills: ["Teaching"],
    preferences: "Morning shifts preferred",
    availability: ["2025-10-21"]
  }
];

const validateProfile = (profile) => {
  const { fullName, address1, city, state, zipCode, skills, availability } = profile;

  if (!fullName || !fullName.trim()) return "Full Name is required";
  if (!address1 || !address1.trim()) return "Address 1 is required";
  if (!city || !city.trim()) return "City is required";
  if (!state || state.length !== 2) return "State must be 2 characters";
  if (!zipCode || !/^\d{5,9}$/.test(zipCode)) return "Zip Code must be 5-9 digits"; // had help with regex check
  if (!Array.isArray(skills) || skills.length === 0) return "At least one skill required";
  if (!Array.isArray(availability) || availability.length === 0)
    return "At least one date required";

  return null;
};

// Get user profile by ID
exports.getUserProfile = (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: "User ID is required" });

  const profile = userProfiles.find(p => p.id === parseInt(userId));
  if (!profile) return res.status(404).json({ message: "User profile not found" });

  return res.json(profile);
};

// update user profile
exports.updateUserProfile = (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: "User ID is required" });

  const profileIndex = userProfiles.findIndex(p => p.id === parseInt(userId));
  if (profileIndex === -1) return res.status(404).json({ message: "User profile not found" });

  const error = validateProfile(req.body);
  if (error) return res.status(400).json({ message: error });

  const updatedProfile = { ...req.body, id: parseInt(userId) };
  userProfiles[profileIndex] = updatedProfile;

  return res.json(updatedProfile);
};

// Helpers for testing
exports.getUserProfiles = () => userProfiles;
exports.resetUserProfiles = (data) => { userProfiles = data; };
*/