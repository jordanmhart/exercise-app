//models
var User = require('../models/user');

//collections
var Users = require('../collections/users');

//encryption
var bcrypt = require('bcrypt-nodejs'),
    passport = require('passport');

//GET
//loads login page -- home page[for now]
exports.login_form = function (req, res){var users = Users;
  users.fetch()
  .then(function (data){
    if(!req.isAuthenticated()){
      res.render('index');
    } else {
      var user = req.user;
      if(user !== undefined) {
        user = user.toJSON();
      }
      res.redirect('/groups');
    }
  })
  .catch(function (error) {
      console.log("errorrrrrr" + error.stack)
  })
}

//POST
//user info for login saved to db --redirect to groups
exports.login = function (req, res){
  var hash = bcrypt.hashSync(req.body.password);
  User.forge({
    password: hash,
    email: req.body.email
  })
  .save()
  .then( function (data) {
    req.method = 'get';
    res.redirect('/groups');
  })
  .catch(function (error) {
    console.log("errorrrrrr" + error.stack)
  })
}

//GET
//gets user's register view file 
exports.register = function (req, res){
  res.render('users/register',{
    title: 'Register'
  });
}

//POST
//user info saved to db when registration is complete
exports.create = function (req, res){
  var hash = bcrypt.hashSync(req.body.password);
  User.forge({
    full_name: req.body.full_name,
    nickname: req.body.nickname,
    password: hash,
    email: req.body.email,
    bio: req.body.bio
  })
  .save()
  .then( function (data) {
    req.method = 'get';
    res.redirect('/groups');
  })
  .catch(function (error) {
    console.log("errorrrrrr" + error.stack)

  })
}


