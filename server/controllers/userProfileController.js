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

// Update user profile
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
