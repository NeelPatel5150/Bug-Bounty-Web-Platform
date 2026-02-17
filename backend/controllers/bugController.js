const Bug = require('../models/Bug');
const Submission = require('../models/Submission');
const User = require('../models/User');

// @desc    Create a bug
// @route   POST /api/bugs
// @access  Private
const createBug = async (req, res) => {
    const { title, description, bountyAmount } = req.body;

    if (!title || !description || !bountyAmount) {
        res.status(400).json({ message: 'Please add all fields' });
        return;
    }

    if (bountyAmount <= 0) {
        res.status(400).json({ message: 'Bounty must be greater than 0' });
        return;
    }

    const bug = await Bug.create({
        title,
        description,
        bountyAmount,
        createdBy: req.user.id
    });

    res.status(201).json(bug);
};

// @desc    Get all bugs
// @route   GET /api/bugs
// @access  Public
const getBugs = async (req, res) => {
    // Maybe populate creator name for UI
    const bugs = await Bug.find().populate('createdBy', 'name totalRewards').sort({ createdAt: -1 });
    res.json(bugs);
};

// @desc    Get bug by ID
// @route   GET /api/bugs/:id
// @access  Public
const getBugById = async (req, res) => {
    const bug = await Bug.findById(req.params.id)
        .populate('createdBy', 'name totalRewards')
        .populate('winner', 'name');

    if (bug) {
        res.json(bug);
    } else {
        res.status(404).json({ message: 'Bug not found' });
    }
};

// @desc    Approve submission
// @route   PATCH /api/bugs/:id/approve/:submissionId
// @access  Private (Creator Only)
const approveSubmission = async (req, res) => {
    const { id, submissionId } = req.params;

    const bug = await Bug.findById(id);

    if (!bug) {
        res.status(404).json({ message: 'Bug not found' });
        return;
    }

    // Verify creator
    if (bug.createdBy.toString() !== req.user.id) {
        res.status(401).json({ message: 'User not authorized to approve' });
        return;
    }

    // Verify Open
    if (bug.status === 'Closed') {
        res.status(400).json({ message: 'Bug is already closed' });
        return;
    }

    const submission = await Submission.findById(submissionId);

    if (!submission) {
        res.status(404).json({ message: 'Submission not found' });
        return;
    }

    if (submission.bugId.toString() !== bug.id) {
        res.status(400).json({ message: 'Submission does not belong to this bug' });
        return;
    }

    // Use a transaction ideally, but for simpler MERN:

    // 1. Update Submission
    submission.status = 'Approved';
    await submission.save();

    // 2. Update Bug
    bug.status = 'Closed';
    bug.winner = submission.submittedBy;
    await bug.save();

    // 3. Update Winner Rewards
    const winner = await User.findById(submission.submittedBy);
    if (winner) {
        console.log(`Updating rewards for ${winner.name}: ${winner.totalRewards} + ${bug.bountyAmount}`);
        winner.totalRewards = (winner.totalRewards || 0) + Number(bug.bountyAmount);
        await winner.save();
        console.log(`New Balance: ${winner.totalRewards}`);
    } else {
        console.error('Winner user not found during approval');
    }

    res.json({ message: 'Submission approved', bug, submission });
};

module.exports = {
    createBug,
    getBugs,
    getBugById,
    approveSubmission
};
