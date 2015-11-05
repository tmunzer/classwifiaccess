var db = require("./../app").db;

function GroupSerializer(row){
    this.group = new Group();
    this.group.groupId = row.id;
    this.group.groupName = row.groupName;
    return this.group;
}

function Group(){
    this.groupId="";
    this.groupName="";
}

findOne = function(fields, options, callback){
    db.findOne("UserGroup", fields, options, function(err, group){
        if (err){
            callback(err);
        }
        callback(err, group);
    });
};

findById = function(rowId, options, callback){
    db.findById("UserGroup", rowId, options, function(err, group){
        if (err){
            return err;
        }
        callback(err, group);
    });
};

getAll = function(options, callback){
    var options = options || {"orderBy":"groupName"};
    db.getAll("UserGroup", options, function(err, groups){
        if (err){
            return err;
        }
        callback(err, groups);
    })
};

module.exports = Group;
module.exports.findOne = findOne;
module.exports.findById = findById;
module.exports.getAll = getAll;
module.exports.GroupSerializer = GroupSerializer;