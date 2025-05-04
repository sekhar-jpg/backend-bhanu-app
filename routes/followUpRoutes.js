const express = require('express');
const router = express.Router();
const followUpController = require('../controllers/followUpController');

// Add a new follow-up
router.post('/add-follow-up', followUpController.addFollowUp);

// Get today's follow-ups
router.get('/today-follow-ups', followUpController.getTodaysFollowUps);

module.exports = router;
