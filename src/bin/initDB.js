const User = require("./models/user");
const Group = require("./models/group");

function checkAdmin(GroupId) {
    const user = {
        email: 'admin@aerohive.com',
        password: 'aerohive',
        enable: true,
        GroupId: GroupId
    }
    User.find({}, function (err, users) {        
        if (err) console.log(err);
        else if (!users || users.length == 0) {
            console.log("creating ", user)
            User.create(user, function (err, res) {
                if (err) console.log(err);
                else console.log(res);
            })
        }
    })
}
function checkGroups(cb) {
    console.log("Checking Administrator group.");
    Group.findOne({ name: 'Administrator' }, function (err, group) {
        if (err) console.log(err);
        else if (!group) Group.create({ name: 'Administrator', value: 0 }, function (err, group) {
            if (err) console.log(err);
            else cb(group)
        })
        else cb(group)
    })
    console.log("Checking Operator group.");
    Group.findOne({ name: 'Operator' }, function (err, group) {
        if (err) console.log(err);
        else if (!group) Group.create({ name: 'Operator', value: 1 }, function (err) {
            if (err) console.log(err);
        })
    })
    console.log("Checking Teacher group.");
    Group.findOne({ name: 'Teacher' }, function (err, group) {
        if (err) console.log(err);
        else if (!group) Group.create({ name: 'Teacher', value: 2 }, function (err) {
            if (err) console.log(err);
        })
    })
    console.log("Checking Monitor group.");
    Group.findOne({ name: 'Monitor' }, function (err, group) {
        if (err) console.log(err);
        else if (!group) Group.create({ name: 'Monitor', value: 3 }, function (err) {
            if (err) console.log(err);
        })
    })
}


module.exports = function init() {
    console.log("validating default values");
    checkGroups(function (groupId) {
        console.log("admin group is " + groupId);
        checkAdmin(groupId);
    })
}