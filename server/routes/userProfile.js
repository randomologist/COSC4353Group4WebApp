const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile, createUserProfile } = require("../controllers/userProfileController");

router.post("/", createUserProfile); // create new user profile
router.get("/:userId", getUserProfile); // look up by id
router.put("/:userId", updateUserProfile); // update profile by id

module.exports = router;