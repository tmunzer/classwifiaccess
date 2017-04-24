const mongoose = require('mongoose');
const School = require('./school');

const AccountSchema = new mongoose.Schema({
    school_id: { type: mongoose.Schema.ObjectId, ref: "School" },
    ownerId: { type: String, required: true, unique: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    vpcUrl: { type: String, required: true },
    vhmId: { type: String, required: true },
    expireAt: { type: String, required: true },
    created_at: { type: Date },
    updated_at: { type: Date }
});


const Account = mongoose.model('Account', AccountSchema);


// Pre save
AccountSchema.pre('save', function (next) {
    const now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

module.exports = Account;
