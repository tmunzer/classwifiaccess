const mongoose = require('mongoose');
const Classroom = require('./classroom');
const User = require('./user');
const School = require('./school');

const LessonSchema = new mongoose.Schema({
    school_id:  {type: mongoose.Schema.ObjectId, ref:"School"},
    classroom_id: {type: mongoose.Schema.ObjectId, ref:"Classroom"},
    user_id:  {type: mongoose.Schema.ObjectId, ref:"User"},
    startDate: { type : Date, default: Date.now },
    endDate: { type : Date, default: Date.now },
    created_at    : { type: Date },
    updated_at    : { type: Date }
});


const Lesson = mongoose.model('Lesson', LessonSchema);


// Pre save
LessonSchema.pre('save', function(next) {
    const now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

module.exports = Lesson;