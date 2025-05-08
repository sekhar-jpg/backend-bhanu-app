const express = require('express');
const router = express.Router();
const followUpController = require('../controllers/followUpController');

// POST: Add new follow-up
router.post('/add', followUpController.addFollowUp);

// GET: Get today's follow-ups
router.get('/today', followUpController.getTodaysFollowUps);

// DELETE: Delete follow-up by ID
router.delete('/delete/:id', followUpController.deleteFollowUp);

module.exports = router;
