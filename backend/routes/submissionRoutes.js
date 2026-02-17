const express = require('express');
const router = express.Router();
const { submitSolution, getSubmissionsForBug } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:bugId').post(protect, submitSolution).get(getSubmissionsForBug);

module.exports = router;
