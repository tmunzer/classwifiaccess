const mongoose = require('mongoose');
const Devices = reqiuire('./device');
const School = require('./school');

const ClassroomSchema = new mongoose.Schema({
    school_id:  {type: mongoose.Schema.ObjectId, ref:"School"},
    name: {type: String, required: true},
    device_ids: [{type: mongoose.Schema.ObjectId, ref:"Devices"}],
    created_at    : { type: Date },
    updated_at    : { type: Date }
});


const Classroom = mongoose.model('Classroom', ClassroomSchema);


// Pre save
ClassroomSchema.pre('save', function(next) {
    const now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

module.exports = Classroom;

