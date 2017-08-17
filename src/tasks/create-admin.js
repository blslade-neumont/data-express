let bcrypt = require('bcrypt-nodejs'),
    { User } = require('../models/user');

(() => {
    User.remove({ username: 'admin' }, (err) => {
        if (err) {
            console.error(err);
            console.error('Failed to remove old user');
            return;
        }
        bcrypt.hash('pass', null, null, (err, hash) => {
            let user = new User({
                username: 'admin',
                passwordHash: hash,
                isAdmin: true,
                email: '',
                age: 0,
                q1: '0',
                q2: '0',
                q3: '0'
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
    });
})();
