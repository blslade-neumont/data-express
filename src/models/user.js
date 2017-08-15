let { mongoose } = require('./connection');

var userSchema = mongoose.Schema({
    username: String,
    passwordHash: String,
    // email: String,
    // age: Number,
    // answer1: String,
    // answer2: String,
    // answer3: String,
    isAdmin: Boolean
});

let User = mongoose.model('Users', userSchema);
module.exports.User = User;
