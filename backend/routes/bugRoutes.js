const express = require('express');
const router = express.Router();
const { createBug, getBugs, getBugById, approveSubmission } = require('../controllers/bugController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBug).get(getBugs);
router.route('/:id').get(getBugById);
router.route('/:id/approve/:submissionId').patch(protect, approveSubmission);

module.exports = router;
