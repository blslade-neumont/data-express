var express = require('express'),
    pug = require('pug'),
    path = require('path'),
    // route = require('./routes/routes.js'),
    bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));

var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});
// app.get('/create', route.create);
// app.get('/edit/:id', route.edit);
// app.get('/details/:id', route.details);
// app.post('/create', urlencodedParser, route.createPerson);
// app.post('/edit/:id', urlencodedParser, route.editPerson);
// app.get('/delete/:id', route.delete);

app.listen(8080);
