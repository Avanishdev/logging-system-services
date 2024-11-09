const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    actionType: String,
    timestamp: { type: Date, default: Date.now },
    userId: String,
    role: String,
    additionalData: Object,
    isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Log', LogSchema);
