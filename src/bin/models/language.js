const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
    language:  {type: String, required: true},
    created_at    : { type: Date },
    updated_at    : { type: Date }
});


const Language = mongoose.model('Language', LanguageSchema);


// Pre save
LanguageSchema.pre('save', function(next) {
    const now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

module.exports = Language;
