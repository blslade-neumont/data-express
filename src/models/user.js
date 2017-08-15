let { mongoose } = require('./connection');

var userSchema = mongoose.Schema({
    username: String,
    passwordHash: String,
    answer1: String,
    answer2: String,
    answer3: String,
    isAdmin: Boolean
});

export let User = mongoose.model('Users', userSchema);
