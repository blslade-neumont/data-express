var express = require('express'),
    pug = require('pug'),
    path = require('path'),
    // route = require('./routes/routes.js'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');

var app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser('The answer to the question of life, the universe, and everything'));

var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedParser);

app.get('/', (req, res) => {
    var loggedIn = (req.cookies.c1 === 'true');
    if (!loggedIn) {res.render('index', { title: 'Home' });}
    else { res.render('index', {title: 'Home',  msg: "YOU LOGGED IN"}); }
});
app.post('/', (req, res) => {
    console.log(req.body);
    res.render('index', req.body);
});

app.get('/register', (req, res) => {
    res.cookie('c1', 'true');
    res.render('register', { title: 'Register' });
});

app.get('/login', (req, res) => {
    res.cookie('c1', 'true');
    res.render('login', { title: 'Login' });
});

app.get('/profile', (req, res) => {
    res.render('profile', { title: 'Profile' });
});

app.get('/edit-profile', (req, res) => {
    res.render('edit-profile', { title: 'Edit Profile' });
});

app.get('/users', (req, res) => {
    res.render('users', { title: 'Users' });
});

app.get('/logout', (req, res) => {
    res.clearCookie('c1');
    res.render('index', { title: 'Home', msg: 'Logout successful' });
});

// app.get('/create', route.create);
// app.get('/edit/:id', route.edit);
// app.get('/details/:id', route.details);
// app.post('/create', urlencodedParser, route.createPerson);
// app.post('/edit/:id', urlencodedParser, route.editPerson);
// app.get('/delete/:id', route.delete);

app.listen(8080);
