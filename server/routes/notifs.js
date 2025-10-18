const express = require("express")
const { getNotifs } = require('../controllers/notifController.js')

const router = express.Router();

router.get('/',getNotifs);
module.exports = router;