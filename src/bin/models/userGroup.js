const mongoose = require('mongoose');

const UserGroupSchema = new mongoose.Schema({
    name: {type: String, required: true},
    created_at    : { type: Date },
    updated_at    : { type: Date }
});


const UserGroup = mongoose.model('UserGroup', UserGroupSchema);


// Pre save
UserGroupSchema.pre('save', function(next) {
    const now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

module.exports = UserGroup;

