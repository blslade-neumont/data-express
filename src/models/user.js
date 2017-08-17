let { mongoose } = require('./connection');

var userSchema = mongoose.Schema({
    username: String,
    passwordHash: String,
    email: String,
    age: Number,
    q1: String,
    q2: String,
    q3: String,
    isAdmin: Boolean
});

let User = mongoose.model('Users', userSchema);
module.exports.User = User;
