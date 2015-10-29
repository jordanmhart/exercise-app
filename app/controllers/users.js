//models
var User = require('../models/user');
  // Exercise = require('../models/exercise');

//collections
var Users = require('../collections/users');
  // Exercises = require('../collections/exercises');
//encryption
var bcrypt = require('bcrypt-nodejs'),
    passport = require('passport');

//GET
//loads login page -- home page[for now]
exports.showLoginPage = function (req, res){
  if(!req.isAuthenticated()){
    res.render('index');
  } else {
    res.redirect('/groups');
  }  
}

//POST
//authenticated users will be able to login
exports.submitLogin = function(req, res, next) {
  passport.authenticate(
    'local',
    {failureRedirect: '/register'},
    function(err, user, info) {

      // if(err) {
      //     res.render('index', {title: 'Sign In', errorMessage: err.message});
      // }

      // if(!user) {
      //     res.render('index', {title: 'Sign In', errorMessage: info.message});
      // }

      req.logIn(user, function(err) {
        if(err) {
          res.render('index', {title: 'Sign In', errorMessage: err.message});
        } else {
          res.redirect('/groups');
        }
      });
    }
  )(req, res, next);
};

//GET
//gets user's register view jade file 
exports.showRegisterPage = function (req, res){
  res.render('users/register',{
    title: 'Register'
  });
}

//POST
//user info saved to db when registration is complete
exports.submitRegister = function (req, res){
  var hash = bcrypt.hashSync(req.body.password);
  User.forge({
    full_name: req.body.full_name,
    initials: req.body.initials,
    password: hash,
    email: req.body.email,
    bio: req.body.bio
  })
  .save()
  .then( function (data) {
    req.method = 'get';
    res.redirect('/');
  })
  .catch(function (error) {
    console.log("errorrrrrr" + error.stack)
  })
}

//GET
exports.showOneUserLog = function (req, res, next) {
  User.forge({
    id: req.params.user_id
  })
  .fetch({
    withRelated: ['exercises']
  })
  .then(function (user){
    res.render('users/show', {
      req_user_id: req.user.get('id'),
      title: 'Exercise Log',
      group_id: req.params.group_id,
      param_user: user.toJSON()
    })
  })
  .catch(function (error) {
    console.log("errorrrrrr" + error.stack)
  })
}

exports.logout = function(req, res, next) {
   if(!req.isAuthenticated()) {
      notFound404(req, res, next);
   } else {
      req.logout();
      res.redirect('/');
   }
};




