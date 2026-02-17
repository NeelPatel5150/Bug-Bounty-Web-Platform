const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema({
    bugId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bug',
        required: true
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    proof: {
        type: String, // URL/Link
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
