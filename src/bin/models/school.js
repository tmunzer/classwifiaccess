const mongoose = require('mongoose');
const Classroom = require('./classroom');
const User = require('./user');

const SchoolSchema = new mongoose.Schema({
    name:  {type: String, required: true},
    configApis: {type: Boolean, required: true},
    sshAdmin:  {type: String, required: true},
    sshPassword:  {type: String, required: true},
    created_at    : { type: Date },
    updated_at    : { type: Date }
});


const School = mongoose.model('School', SchoolSchema);


// Pre save
SchoolSchema.pre('save', function(next) {
    const now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

module.exports = School;
