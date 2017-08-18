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

function countAns(data, ans, question){
    let count = 0;
    for (let i = 0; i < data.length; ++i) {
        if (data[i][question] === ans) { 
            ++count; 
        }
    }

    return count;
}

app.get('/', (req, res) => {
    User.find().exec((err, data) => {
         res.render('index', {req: req, utils: utils, title: 'Home', stats: {
            q1: {a1: (countAns(data, '0', 'q1') / data.length),
                 a2: (countAns(data, '1', 'q1') / data.length),
                 a3: (countAns(data, '2', 'q1') / data.length),
                 a4: (countAns(data, '3', 'q1') / data.length)},
            q2: {a1: (countAns(data, '0', 'q2') / data.length), 
                 a2: (countAns(data, '1', 'q2') / data.length),
                 a3: (countAns(data, '2', 'q2') / data.length),
                 a4: (countAns(data, '3', 'q2') / data.length)},
            q3: {a1: (countAns(data, '0', 'q3') / data.length),
                 a2: (countAns(data, '1', 'q3') / data.length),
                 a3: (countAns(data, '2', 'q3') / data.length),
                 a4: (countAns(data, '3', 'q3') / data.length)}
        }});
    });
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
        res.status(422).render('error', {req: req, utils: utils, title: 'Error', msg: 'Invalid username or password'});
        return;
    }
    email = email || '';
    age = +(age || '0');
    if (`${age}` !== req.body.age) {
        res.status(422).render('error', {req: req, utils: utils, title: 'Error', msg: `Invalid age: ${req.body.age}`});
        return;
    }
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
            res.redirect('/profile');
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
        res.status(422).render('error', {req: req, utils: utils, title: 'Error', msg: `Invalid username or password`});
        return;
    }
    User.findOne({ username: username }, (err, user) => {
        if (!user) {
            res.status(422).render('error', {req: req, utils: utils, title: 'Error', msg: 'Invalid username or password'});
            return;
        }
        bcrypt.compare(password, user.passwordHash, (err, areSame) => {
            if (!areSame) {
                res.status(422).render('error', {req: req, utils: utils, title: 'Error', msg: 'Invalid username or password'});
                return;
            }
            else {
                res.cookie('currentUser', JSON.stringify(user));
                res.redirect('/profile');
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
            res.status(422).render('error', {req: req, utils: utils, title: 'Error', msg: `Could not find user with id ${id}`});
            console.error(err);
            return;
        }
        res.render('edit-profile', { req: req, utils: utils, editingUser: user, title: 'Edit Profile' });
    });
});
app.post('/edit-profile/:id', isLoggedInPolicy, (req, res) => {
    let cuser = req.user;
    let editId = req.params['id'];
    let isMe = false;
    console.log(`editId: ${editId}`);
    console.log(`cuser._id: ${cuser._id}`);
    console.log(typeof cuser._id);
    if (!editId || cuser._id.equals(editId) || editId === 'currentUser') {
        console.log(`WTF: What a Terrible Failure`);
        isMe = true;
        editProfile(cuser);
    }
    else {
        User.findOne({ _id: editId }, (err, user) => {
            if (err) {
                res.status(422).render('error', {req: req, utils: utils, title: 'Error', msg: `Could not find user with id ${id}`});
                console.error(err);
                return;
            }
            editProfile(user);
        });
    }
    
    function editProfile(editingUser) {
        let { password, email, age, q1, q2, q3 } = req.body || {};
        email = email || '';
        age = +(age || '0') || editingUser.age;
        if (`${age}` !== req.body.age && req.body.age) {
            res.status(422).render('error', {req: req, utils: utils, title: 'Error', msg: `Invalid age: ${req.body.age}`});
            return;
        }
        q1 = q1 || editingUser.q1;
        q2 = q2 || editingUser.q2;
        q3 = q3 || editingUser.q3;
        let changeHash = editingUser.passwordHash;
        
        function saveUser() {
            User.findByIdAndUpdate(editingUser._id, { $set: {
                passwordHash: changeHash,
                email: email,
                age: age,
                q1: q1,
                q2: q2,
                q3: q3
            } }, { new: true }, (err, user) => {
                if (isMe) {
                    res.cookie('currentUser', JSON.stringify(user));
                    res.redirect('/profile');
                }
                else {
                    res.redirect('/users');
                }
            });
        }
        
        if (password) {
            bcrypt.hash(password, null, null, (err, hash) => {
                changeHash = hash;
                saveUser();
            });
        }
        else saveUser();
    }
});

app.get('/users', isAdminPolicy, (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            res.status(500).render('error', {req: req, utils: utils, title: 'Error', msg: `Could not find users`});
            console.error(err);
            return;
        }
        res.render('users', { req: req, utils: utils, users: users, title: 'Users' });
    });
});
app.post('/delete-user/:id', isAdminPolicy, (req, res) => {
    let cuser = req.user;
    let editId = req.params['id'];
    if (!editId || cuser._id.equals(editId) || editId === 'currentUser') {
        res.status(422).render('error', {req: req, utils: utils, title: 'Error', msg: `You can't delete the currently logged-in user`});
        return;
    }
    User.remove({ _id: editId }, (err) => {
        if (err) {
            res.status(500).render('error', {req: req, utils: utils, title: 'Error', msg: `Failed to delete user with id ${editId}`});
            console.error(err);
            return;
        }
        res.redirect('/users');
    });
});

// app.get('/create', route.create);
// app.get('/edit/:id', route.edit);
// app.get('/details/:id', route.details);
// app.post('/create', urlencodedParser, route.createPerson);
// app.post('/edit/:id', urlencodedParser, route.editPerson);
// app.get('/delete/:id', route.delete);

app.listen(8080);
