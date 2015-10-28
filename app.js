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
passport.use(new LocalStrategy(function (username, password, done) {
    new User({email: username}).fetch().then(function (data) {
        var user = data;
        if(user === null) {
            return done(null, false, {message: 'Invalid email or password'});
        } else {
            var hash = bcrypt.hashSync(password);
            if(!bcrypt.compareSync(password, user.get('password'))) {
                return done(null, false, {message: 'Invalid email or password'});
            } else {
                return done(null, user);
            }
        }
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.get('email'));
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
app.get('/groups', GroupsController.myGroups);
//TODO: ask Kirk how to keep from conflicting if moved down a line
app.get('/group/create', GroupsController.createForm);
app.get('/group/:id', GroupsController.showOneGroup);
app.post('/group/create', GroupsController.submitGroup);
app.get('/group/:id/edit', GroupsController.editForm);
app.post('/group/:id/delete', GroupsController.deleteOneGroup);


//user routes
app.get('/', UsersController.showLoginPage);
app.post('/login', UsersController.submitLogin);
app.get('/register', UsersController.showRegisterPage);
app.post('/register', UsersController.submitRegister);
app.post('/logout', UsersController.logout);
app.get('/group/:group_id/user/:user_id', UsersController.showOneUserLog);

//exercise routes
//TODO: pull group id out of both/ instead use middleware per Logan
app.post('/exercise/:group_id/create/:date', ExercisesController.logExercise);
app.post('/exercise/:group_id/delete/:id', ExercisesController.deleteExercise);

//membership routes
app.post('/group/:id/invite', MembershipsController.invite);
app.post('/group/:id/update', GroupsController.submitEdit);
app.listen(3000);
console.log('listening on port 3000 and thinking of ice cream');

