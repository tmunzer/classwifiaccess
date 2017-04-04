const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    acsId: {type: String, required: true},
    macAddress: {type: String, required: true},
    hostName: {type: String, required: true},
    serialId: {type: String, required: true},
    model: {type: String, required: true},
    ip: {type: String, required: true},
    simType: {type: String, required: true},
    locations: {type: String, required: true},
    connected: {type: String, required: true},
    created_at    : { type: Date },
    updated_at    : { type: Date }
});


const Device = mongoose.model('Device', DeviceSchema);


// Pre save
DeviceSchema.pre('save', function(next) {
    const now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

module.exports = Device;


