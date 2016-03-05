var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    password: String
});


var UserModel = mongoose.model('User', UserSchema);

UserSchema.pre('save', function (next) {
    var self = this;

    UserModel.find(function (err, bears) {
        console.log(bears);
    })

    UserModel.find({ name: self.name }, function (err, docs) {
        if (!docs.length) {
            console.log('user not exists: ', self.name);
            next();
        } else {
            console.log('user exists: ', self.name);
            next(new Error("User exists!"));
            //next();
        }
    });
});


module.exports = mongoose.model('User', UserSchema);