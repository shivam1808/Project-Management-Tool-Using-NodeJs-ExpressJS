const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
    },
    projectDescription: {
        type: String,
        required: true,
    },
    techUsed: {
        type: String,
        required: true,
    },
    projectLink: {
        type: String,
        required: true,
    },
    projectImage: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
})

module.exports = mongoose.model('Project', projectSchema);