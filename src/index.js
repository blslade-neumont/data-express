var express = require('express'),
    pug = require('pug'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    bcrypt = require('bcrypt-nodejs'),
    { User } = require('./models/user');

var app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser('The answer to the question of life, the universe, and everything'));

var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedParser);

app.use((req, res, next) => {
    req.user = req.cookies.currentUser;
    next();
});

app.get('/', (req, res) => {
    let cuser = req.user || 'Not logged in';
    res.render('index', {req: req, title: 'Home', msg: cuser});
});

app.get('/register', (req, res) => {
    res.render('register', { req: req, title: 'Register' });
});
app.post('/register', (req, res) => {
    let { username, password } = req.body || {};
    if (!username || !password) {
        res.status(422).send(`Invalid username or password`);
        return;
    }
    //email, age, animal, coding, president
    bcrypt.hash(password, null, null, (err, hash) => {
        let user = new User({
            username: username,
            passwordHash: hash,
            isAdmin: false
        });
        user.save((err, user) => {
            res.cookie('currentUser', JSON.stringify(user));
            res.redirect('/edit-profile');
        });
    });
});

app.get('/login', (req, res) => {
    res.render('login', { req: req, title: 'Login' });
});
app.post('/login', (req, res) => {
    let { username, password } = req.body || {};
    if (!username || !password) {
        res.status(422).send(`Invalid username or password`);
        return;
    }
    User.findOne({ username: username }, (err, user) => {
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

app.get('/profile', (req, res) => {
    res.render('profile', { req: req, title: 'Profile' });
});

app.get('/edit-profile', (req, res) => {
    res.render('edit-profile', { req: req, title: 'Edit Profile' });
});

app.get('/users', (req, res) => {
    res.render('users', { req: req, title: 'Users' });
});

// app.get('/create', route.create);
// app.get('/edit/:id', route.edit);
// app.get('/details/:id', route.details);
// app.post('/create', urlencodedParser, route.createPerson);
// app.post('/edit/:id', urlencodedParser, route.editPerson);
// app.get('/delete/:id', route.delete);

app.listen(8080);
