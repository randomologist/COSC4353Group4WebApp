const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile, createUserProfile, getMyProfile } = require("../controllers/userProfileController");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/", authMiddleware, createUserProfile); // create new user profile
router.get("/me", authMiddleware, getMyProfile);
// allow public access to GET by id for tests and basic lookup
router.get("/:userId", getUserProfile); // look up by id
router.put("/:userId", authMiddleware, updateUserProfile); // update profile by id

module.exports = router;