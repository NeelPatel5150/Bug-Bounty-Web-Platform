const Bug = require('../models/Bug');
const Submission = require('../models/Submission');

// @desc    Submit a solution
// @route   POST /api/submissions/:bugId
// @access  Private
const submitSolution = async (req, res) => {
    const { description, proof } = req.body;
    const { bugId } = req.params;

    const bug = await Bug.findById(bugId);
    if (!bug) {
        res.status(404).json({ message: 'Bug not found' });
        return;
    }

    if (bug.status === 'Closed') {
        res.status(400).json({ message: 'Bug is closed' });
        return;
    }

    if (bug.createdBy.toString() === req.user.id) {
        res.status(400).json({ message: 'Creator cannot submit solution' });
        return;
    }

    // Optional: Check if user already submitted pending?
    // Not in spec, but good practice. For now allow multiple.

    const submission = await Submission.create({
        bugId,
        submittedBy: req.user.id,
        description,
        proof
    });

    res.status(201).json(submission);
};

// @desc    Get submissions for a bug
// @route   GET /api/submissions/:bugId
// @access  Private (or Public? Spec implies bug details show submissions)
// Let's make it public for transparency, or maybe just protected?
// "Bug Detail Page (show submissions...)"
// We will secure it or verify if user is creator?
// If public, everyone sees proofs? Maybe not secure for real world, but fine for this MERN demo.
const getSubmissionsForBug = async (req, res) => {
    const submissions = await Submission.find({ bugId: req.params.bugId })
        .populate('submittedBy', 'name');

    res.json(submissions);
};

module.exports = {
    submitSolution,
    getSubmissionsForBug
};
