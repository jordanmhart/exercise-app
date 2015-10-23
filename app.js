var express = require('express'),
    app = express(),
    router = express.Router(),
    path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    bcrypt = require('bcrypt-nodejs'),
    session = require('express-session'),
    LocalStrategy = require('passport-local').Strategy;

var User = require('./app/models/user');

//database
var bookshelf = require('./database/schema');

//passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    new User({email: email}).fetch().then(function (data) {
        var user = data.toJSON();
        var hash = bcrypt.hashSync(password);

        // password never matches :(
        console.log(hash);
        console.log(user.password);

        if(user === null) {
            return done(null, false, {message: 'Invalid email or password'});
        } else {
            user = data.toJSON();
            if(!bcrypt.compareSync(password, user.password)) {
                return done(null, false, {message: 'Invalid email or password'});
            } else {
                return done(null, user);
            }
        }
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (email, done) {
    new User({email: email}).fetch().then(function(user) {
        done(null, user);
    });
});

//view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

//Passport, Sessions, Login
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {
    extended: true
}));
app.use(cookieParser());
// app.use(session({strategic: 'strategic code'}));
app.use(session({secret: 'secret strategic duck code', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

//setting up public folder
app.use(express.static(path.join(__dirname, 'public')));

//controllers
var GroupsController = require('./app/controllers/groups'),
  UsersController = require('./app/controllers/users')
  MembershipsController = require('./app/controllers/memberships'),
  ExercisesController = require('./app/controllers/exercises');

//--------------------------ROUTES--------------------------
//group routes
app.get('/groups', GroupsController.index);
app.get('/group/create', GroupsController.createForm);
app.post('/group/create', GroupsController.create);
app.get('/group/:id/edit',GroupsController.edit);
app.post('/group/:id/update', GroupsController.update);
app.post('/group/:id/delete', GroupsController.destroy);

//user routes
app.get('/', UsersController.login_form);
app.get('/register', UsersController.register);
app.post('/register', UsersController.create);
app.post('/login', UsersController.login)

//exercise routes
app.get('/exercises', ExercisesController.index);
app.post('/exercise/create', ExercisesController.create)
app.post('/exercise/:id/delete', ExercisesController.destroy);

//membership routes
app.post('/group/:id/invite', MembershipsController.create);

app.listen(3000);
console.log('listening on port 3000 and thinking of ice cream');

