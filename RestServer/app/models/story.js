var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StorySchema = new Schema({
    username: String,
    storyID: String,
    startLocation: String,
    endLocation: String,
    startLocation: String,
    style: String,
    sharedFlag: String
});


var StoryModel = mongoose.model('Story', StorySchema);

StorySchema.pre('save', function (next) {
    var self = this;

    StoryModel.find(function (err, users) {
        console.log(users);
    })

    StoryModel.find({ storyID: self.storyID }, function (err, docs) {
        if (!docs.length) {
            console.log('story not exists: ', self.storyID);
            next();
        } else {
            console.log('story exists: ', self.storyID);
            next(new Error("Story exists!"));
            //next();
        }
    });
});


module.exports = mongoose.model('Story', StorySchema);