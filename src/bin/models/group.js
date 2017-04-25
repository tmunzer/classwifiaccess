const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: String, required: true, unique: true },
    created_at: { type: Date },
    updated_at: { type: Date }
});


const Group = mongoose.model('Group', GroupSchema);


// Pre save
GroupSchema.pre('save', function (next) {
    const now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

module.exports = Group;

