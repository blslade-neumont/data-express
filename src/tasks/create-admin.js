let bcrypt = require('bcrypt-nodejs'),
    { User } = require('../models/user');

(() => {
    User.findOne({ username: 'admin' }, (err, user) => {
        if (user) {
            if (!user.isAdmin) {
                user.isAdmin = true;
                user.email = '';
                user.age = 0;
                user.q1 = '0';
                user.q2 = '0';
                user.a3 = '0';
                user.save(() => {
                    console.log('The admin account has been updated.');
                    process.exit(0);
                });
                return;
            }
            console.error('The admin account already exists.');
            process.exit(0);
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
                a3: '0'
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
