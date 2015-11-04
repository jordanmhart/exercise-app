//models
var User = require('../models/user');
var Membership = require('../models/membership');
var Group = require('../models/group');
//collections
var Users = require('../collections/users');

//encryption
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');

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
exports.submitLogin = function (req, res, next) {
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
      req.logIn(user,function (err) {
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
  .then(function (data) {
    req.method = 'get';
    res.redirect('/');
  })
  .catch(function (error) {
    console.log("errorrrrrr" + error.stack)
  })
}

//GET
//shows single user's exercise log
exports.showOneUserLog = function (req, res, next) {
  Group.forge({id: req.params.group_id})
  .fetch()
  .then(function (group){
    var groupStartDate = group.toJSON().start_date;
    var groupEndDate = group.toJSON().end_date; 

    User.forge({id: req.params.user_id})
    .fetch({
      withRelated: [{exercises: function (qb) {
        qb
        .where('date', '>', groupStartDate) 
        .andWhere('date', '<', groupEndDate) 
      }}]
    })
    .then(function (shown_user){
      Membership.forge({
        group_id: req.params.group_id,
        user_id: req.params.user_id
      })
      .fetch() //TODO: check for best practice
      .then(function (shown_membership){
        Membership.forge({
          group_id: req.params.group_id,
          user_id: req.user.get('id')
        })
        .fetch()
        .then(function (viewing_membership){
          res.render('users/show',{
            viewing_user_id: req.user.get('id'),
            title: 'Exercise Log',
            group_id: req.params.group_id,
            shown_user: shown_user.toJSON(),
            viewing_membership: viewing_membership.toJSON().role,
            shown_membership: shown_membership.toJSON().role,
            req_user_id: req.user.get('id')
          })
        })
      })
    })
    .catch(function (error) {
      console.log("errorrrrrr" + error.stack)
    })
  })
  .catch(function (error) {
    console.log("errorrrrrr" + error.stack)
  })
}

// exports.showOneUserLog = function (req, res, next) {
//   User.forge({
//     id: req.params.user_id
//   })
//   .fetch({
//     withRelated: ['exercises']
//   })
//   .then(function (user){
//     res.render('users/show', {
//       req_user_id: req.user.get('id'),
//       title: 'Exercise Log',
//       group_id: req.params.group_id,
//       param_user: user.toJSON()
//     })
//   })
//   .catch(function (error) {
//     console.log("errorrrrrr" + error.stack)
//   })
// }

//POST
//user logs out
exports.logout = function(req, res, next) {
  if(!req.isAuthenticated()) {
    notFound404(req, res, next);
  } else {
      req.logout();
      res.redirect('/');
  }
};




