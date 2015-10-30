//models
var Membership = require('../models/membership'),
  User = require('../models/user'),
  Group = require('../models/group');
  
//collections
var Memberships = require('../collections/memberships');

// //GET
// exports.index = function(req, res){
//   res.render('memberships/index');
// }

//POST
//admin create membership for user
//TODO: enable admin to specify email instead of id
exports.invite = function (req, res){
  var user_id = req.body.user_id;
  var group_id = req.params.id;

  // User.forge({
  //   email: req.body.email
  // })
  // .fetch()
  // .then( function (user){
  //   user_id = user.id;
  // });

  Membership.forge({
    user_id: user_id,
    group_id: group_id,
    membership: req.body.membership
  })
  .save()
  .then( function (data) {
    req.method = 'get';
    res.redirect('/group/' + group_id);
  })
  .catch(function (error) {
    console.log("errorrrrrr" + error.stack)
  })
}

//POST
//delete membership
exports.removeFromGroup = function (req, res){
  var user_id = req.params.user_id;
  var group_id = req.params.group_id;
  
  Membership.forge({
    user_id: user_id,
    group_id: group_id
  })
  .query({where: {user_id: user_id}, andWhere: {group_id: group_id}})
  .destroy()
  .then(function (membership){
    req.method = 'get';
    res.redirect('/group/' + group_id);
  })
  .catch(function (error) {
    console.log("errorrrrrr" + error.stack)
  })
};

//POST
//promotes member to admin
exports.promoteUser = function (req, res){
  var  user_id = req.params.user_id;
  var group_id = req.params.group_id;

  Membership.forge({
    user_id: user_id,
    group_id: group_id
  })
  .fetch()
  .then(function (membership){
    Membership.forge({
      id: membership.id,
      membership: 'admin'
    })
    .save()
    .then(function (membership){
      res.redirect('/group/' + group_id + '/user/' + user_id);
    })
    .catch(function (error) {
      console.log("errorrrrrr" + error.stack)
    })
  })
  .catch(function (error) {
    console.log("errorrrrrr" + error.stack)
  })
}

//POST
//demotes admin to member
exports.demoteUser = function (req, res){
  var  user_id = req.params.user_id;
  var group_id = req.params.group_id;

  Membership.forge({
    user_id: user_id,
    group_id: group_id
  })
  .fetch()
  .then(function (membership){
    Membership.forge({
      id: membership.id,
      membership: 'member'
    })
    .save()
    .then(function (membership){
      res.redirect('/group/' + group_id + '/user/' + user_id);
    })
    .catch(function (error) {
      console.log("errorrrrrr" + error.stack)
    })
  })
  .catch(function (error) {
    console.log("errorrrrrr" + error.stack)
  })
}

