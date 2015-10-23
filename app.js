var express = require('express'),
  app = express(),
  path = require('path'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  passport = require('passport'),
  bcrypt = require('bcrypt-nodejs'),
  session = require('express-session'),
  LocalStrategy = require('passport-local').Strategy;

//controllers
var GroupsController = require('./app/controllers/groups'),
  UsersController = require('./app/controllers/users')
  MembershipsController = require('./app/controllers/memberships'),
  ExercisesController = require('./app/controllers/exercises');

//database
var bookshelf = require('./database/schema');

//setting up public folder
app.use(express.static(path.join(__dirname, 'public')));

//all env
app.set('port', process.env.PORT || 3000);

//view engine
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

//passport
//user authentication
var User = ('./models/user');

//bcrypt encryption--ASK KIRK IF this should move?
passport.use(new LocalStrategy(function (email, password, done) {
   new User({email: email}).fetch()
   .then(function (data) {
      var user = data;
      // req.session.user = user;
      if(user === null) {
         return done(null, false, {message: 'Invalid email'});
      } else {
         user = data.toJSON();
         if(!bcrypt.compareSync(password, user.password)) {
            return done(null, false, {message: 'Invalid password'});
         } else {
            return done(null, user);
         }
      }
   });
}));

//serialize user
passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(email, done) {
  new User({email: email}).fetch()
  .then(function (user) {
  done(null, user.email);
 });
});

//view engine
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({secret: 'keyboard cat', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());


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

