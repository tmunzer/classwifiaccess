var db = require(appRoot + "/app").db;

function GroupSerializer(row){
    this.group = new Group();
    this.id = row.id;
    this.group.groupName = row.groupName;
}

function Group(){
    this.id="";
    this.groupName="";
}

findOne = function(filters, options, callback){
    db.findOne("UserGroup", filters, options, function(err, group){
        if (err) callback(err);
        else callback(err, group);
    });
};

findById = function(rowId, filters, options, callback){
    db.findById("UserGroup", rowId, filters, options, function(err, group){
        if (err) callback(err);
        else callback(err, group);
    });
};

getAll = function(options, callback){
    var rOptions = options || {"orderBy":"id"};
    db.findAll("UserGroup", null, rOptions, function (err, groups) {
        if (err) callback(err);
        else callback(err, groups);
    });
};

module.exports = Group;
module.exports.findOne = findOne;
module.exports.findById = findById;
module.exports.getAll = getAll;
module.exports.GroupSerializer = GroupSerializer;