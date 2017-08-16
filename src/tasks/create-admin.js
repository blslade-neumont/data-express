let bcrypt = require('bcrypt-nodejs'),
    { User } = require('../models/user');

(() => {
    User.findOne({ username: 'admin' }, (err, user) => {
        if (user) {
            console.error('The admin account already exists.');
            process.exit(0);
            return;
        }
        
        bcrypt.hash('pass', null, null, (err, hash) => {
            let user = new User({
                username: 'admin',
                passwordHash: hash,
                isAdmin: false
            });
            user.save((err, user) => {
                if (err) {
                    console.error('Failed to create adnmin.');
                    console.error(err);
                    process.exit(0);
                }
                else {
                    console.log(`Admin creation successful.`);
                    process.exit(0);
                }
            });
        });
    })
})();
