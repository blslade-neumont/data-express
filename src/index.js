let express = require('express'),
    pug = require('pug'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    bcrypt = require('bcrypt-nodejs'),
    { User } = require('./models/user'),
    { extractUserPolicy, isLoggedInPolicy, isAdminPolicy } = require('./policies')
    utils = require('./utils');

let app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser('The answer to the question of life, the universe, and everything'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(extractUserPolicy);

app.get('/', (req, res) => {
    let cuser = req.user || 'Not logged in';
    res.render('index', {req: req, utils: utils, title: 'Home', msg: JSON.stringify(cuser), stats: {
        q1: {a1: Math.random(),
             a2: Math.random(),
             a3: Math.random(),
             a4: Math.random()},
        q2: {a1: Math.random(),
             a2: Math.random(),
             a3: Math.random(),
             a4: Math.random()},
        q3: {a1: Math.random(),
             a2: Math.random(),
             a3: Math.random(),
             a4: Math.random()}
    }});
});

app.get('/register', (req, res) => {
    if (req.user) {
        res.redirect('/');
        return;
    }
    res.render('register', { req: req, utils: utils, title: 'Register' });
});
app.post('/register', (req, res) => {
    let { username, password, email, age, q1, q2, q3 } = req.body || {};
    if (!username || !password) {
        res.status(422).send(`Invalid username or password`);
        return;
    }
    email = email || '';
    age = +(age || '0');
    q1 = q1 || '0';
    q2 = q2 || '0';
    q3 = q3 || '0';
    bcrypt.hash(password, null, null, (err, hash) => {
        let user = new User({
            username: username,
            passwordHash: hash,
            isAdmin: false,
            email: email,
            age: age,
            q1: q1,
            q2: q2,
            q3: q3
        });
        user.save((err, user) => {
            res.cookie('currentUser', JSON.stringify(user));
            res.redirect('/edit-profile');
        });
    });
});

app.get('/login', (req, res) => {
    if (req.user) {
        res.redirect('/');
        return;
    }
    res.render('login', { req: req, utils: utils, title: 'Login' });
});
app.post('/login', (req, res) => {
    let { username, password } = req.body || {};
    if (!username || !password) {
        res.status(422).send(`Invalid username or password`);
        return;
    }
    User.findOne({ username: username }, (err, user) => {
        if (!user){
            res.status(401).send('Invalid');
            return;
        }
        bcrypt.compare(password, user.passwordHash, (err, areSame) => {
            if (!areSame) {
                res.status(401).send('Invalid');
                return;
            }
            else {
                res.cookie('currentUser', JSON.stringify(user));
                res.redirect('/edit-profile');
                return;
            }
        });
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie('currentUser');
    res.redirect('/');
});

app.get('/profile', isLoggedInPolicy, (req, res) => {
    res.render('profile', { req: req, utils: utils, title: 'Profile' });
});

app.get('/edit-profile', isLoggedInPolicy, (req, res) => {
    res.render('edit-profile', { req: req, utils: utils, editingUser: req.user, title: 'Edit Profile' });
});
app.get('/edit-profile/:id', isLoggedInPolicy, (req, res) => {
    let id = req.params['id'];
    User.findOne({ _id: id }, (err, user) => {
        if (err) {
            res.status(422).send(err);
            return;
        }
        res.render('edit-profile', { req: req, utils: utils, editingUser: user, title: 'Edit Profile' });
    });
});
app.post('/edit-profile/:id', isLoggedInPolicy, (req, res) => {
    let cuser = req.user;
    let editId = req.params['id'];
    if (!editId || editId === cuser._id || editId === 'currentUser') editProfile(cuser);
    else {
        User.findOne({ _id: editId }, (err, user) => {
            if (err) {
                res.status(422).send(err);
                return;
            }
            editProfile(user);
        });
    }
    
    function editProfile(editingUser) {
        let { password, email, age, q1, q2, q3 } = req.body || {};
        email = email || '';
        age = +(age || '0') || editingUser.age;
        q1 = q1 || editingUser.q1;
        q2 = q2 || editingUser.q2;
        q3 = q3 || editingUser.q3;
        
        let user = new User({
            username: editingUser.username,
            passwordHash: editingUser.passwordHash,
            isAdmin: editingUser.isAdmin,
            email: email,
            age: age,
            q1: q1,
            q2: q2,
            q3: q3
        });
        
        function saveUser() {
            user.save((err, user) => {
                res.cookie('currentUser', JSON.stringify(user));
                if (cuser._id === editingUser._id) {
                    res.redirect('/profile');
                }
                else {
                    res.redirect('/users');
                }
            });
        }
        
        if (!password) {
            bcrypt.hash(password, null, null, (err, hash) => {
                user.passwordHash = hash;
                saveUser();
            });
        }
        else saveUser();
    }
});

app.get('/users', isAdminPolicy, (req, res) => {
    res.render('users', { req: req, utils: utils, title: 'Users' });
});

// app.get('/create', route.create);
// app.get('/edit/:id', route.edit);
// app.get('/details/:id', route.details);
// app.post('/create', urlencodedParser, route.createPerson);
// app.post('/edit/:id', urlencodedParser, route.editPerson);
// app.get('/delete/:id', route.delete);

app.listen(8080);
