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

//view engine
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

//routes for group
app.get('/', GroupsController.index);


app.listen(3000);
console.log('listening on port 3000 and thinking of ice cream');