var express = require('express'),
  app = express(),
  path = require('path'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  passport = require('passport'),
  bcrypt = require('bcrypt-nodejs'),
  LocalStrategy = require('passport-local').Strategy;

var GroupsController = require('./app/controllers/groups-controller');
//database
var bookshelf = require('./database/schema');


//setting up public folder
app.use(express.static(path.join(__dirname, 'public')));

//all env
app.set('port', process.env.PORT || 3000);

//view engine
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

//render index
// app.get('/', function (req, res) {
//   res.render('index', { title: 'xercise app'});
// });

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


//group routes
app.get('/', GroupsController.index);

//user routes



app.listen(3000);
console.log('listening on port 3000 and thinking of ice cream');