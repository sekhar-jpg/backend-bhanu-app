const express = require('express');
const router = express.Router();
const followUpController = require('../controllers/followUpController');

// Add a new follow-up
router.post('/', followUpController.addFollowUp);

// Get today's follow-ups
router.get('/today', followUpController.getTodaysFollowUps);

// Delete a follow-up
router.delete('/:id', followUpController.deleteFollowUp);

module.exports = router;
