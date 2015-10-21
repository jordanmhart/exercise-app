var express = require('express'),
  app = express(),
  path = require('path'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  passport = require('passport'),
  bcrypt = require('bcrypt-nodejs'),
  LocalStrategy = require('passport-local').Strategy;

//controllers
var GroupsController = require('./app/controllers/groups'),
  UsersController = require('./app/controllers/users');

//database
var bookshelf = require('./database/schema');

//passport
//user authentication
var User = ('./models/user'); 

//bcrypt encryption--ASK KIRK IF this should move?
passport.use(new LocalStrategy(function (username, password, done) {
   new User({username: username}).fetch()
   .then(function (data) {
      var user = data;
      // req.session.user = user;
      if(user === null) {
         return done(null, false, {message: 'Invalid username'});
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
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  new User({id: id}).fetch()
  .then(function (user) {
  done(null, user.id);
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
app.get('/creategroup', GroupsController.creategroup);
app.post('/creategroup', GroupsController.create);

//user routes
app.get('/', UsersController.login_form);
app.get('/register', UsersController.register);
app.post('/register', UsersController.create);
app.post('/login', UsersController.login)



app.listen(3000);
console.log('listening on port 3000 and thinking of ice cream');

