const mongoose = require('mongoose');
const School = require('./school');
const Group = require('./group');

const bCrypt = require('bcryptjs');

function cryptPassword(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

function capitalize(val) {
    if (typeof val !== 'string') val = '';
    return val.charAt(0).toUpperCase() + val.substring(1);
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const UserSchema = new mongoose.Schema({
    name: {
        first: { type: String, set: capitalize, trim: true, default: "" },
        last: { type: String, set: capitalize, trim: true, default: "" }
    },
    email: { type: String, required: true, unique: true, validator: validateEmail },
    password: { type: String, required: true, set: cryptPassword },
    enable: { type: Boolean, default: false },
    GroupId: { type: mongoose.Schema.ObjectId, ref: "Group" },
    SchoolId: { type: mongoose.Schema.ObjectId, ref: "School" },
    lastLogin: Date,
    created_at: { type: Date },
    updated_at: { type: Date }
});

const User = mongoose.model('User', UserSchema);
User.findWithGroup = function (filters, callback) {
    this.find(filters)
        .populate('GroupId')
        .exec(function (err, users) { callback(err, users) })
}
User.findByIdWithGroup = function (id, callback) {
    this.findById(id)
        .populate('GroupId')
        .exec(function (err, user) { callback(err, user) })
}
User.findOneWithGroup = function (filters, callback) {
    this.findOne(filters)
        .populate('GroupId')
        .exec(function (err, user) { callback(err, user) })
}
User.newLogin = function (email, password, callback) {
    this.findOneWithGroup({ email: email }, function (err, user) {
        if (err) callback(err, null);
        else if (!user) {
            console.log("no user");
            callback(null, false);
        }
        else {
            if (user.enabled == false) callback(null, false);
            else if (!bCrypt.compareSync(password, user.password)) callback(null, false);
            else {
                user.lastLogin = new Date();
                user.save(function (err) {
                    console.log(err);
                    callback(null, user);
                });
            }
        }
    })
};




// Pre save
UserSchema.pre('save', function (next) {
    const now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

module.exports = User;
