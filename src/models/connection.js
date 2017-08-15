let mongoose = require('mongoose');
let Bluebird = require('bluebird');
mongoose.Promise = Bluebird;
mongoose.connect('mongodb://localhost/data');

let mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function (callback) { });

export { mongoose };
