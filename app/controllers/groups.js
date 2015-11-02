//models
var Group = require('../models/group');
var Membership = require('../models/membership');
var User = require('../models/user');


//collections
var Groups = require('../collections/groups');
var Users = require('../collections/users');
var passport = require('passport');

//GET
//loads index page of groups -- list of groups
exports.myGroups = function(req, res){ 
  User.forge({
    id: req.user.get('id')
  })
  .fetch({
    withRelated:['groups']
  })
  .then(function (user){
    res.render('groups/index',{
      title: 'My Groups',
      user_id: req.user.get('id'),
      myGroups: user.toJSON().groups
    })
  })
  .catch(function (error) {
    console.log("errorrrrrr" + error.stack)
  })
}

// exports.myGroups = function(req, res){ 
//   Users.fetch()
//   .then(function (data){
//     if(!req.isAuthenticated()){
//       res.redirect('/');
//     } else {
//       Groups.fetch()
//       .then(function (data){
//         res.render('groups/index',{
//           title: 'My Groups',
//           user_id: req.user.get('id'),
//           myGroups: data.toJSON()
//         })
//       })
//       .catch(function (error) {
//         console.log("errorrrrrr" + error.stack)
//       })
//     }
//   })
// }

//GET
//when clicked, views a single group
exports.showOneGroup = function (req, res){
Users.fetch()
.then(function (data){
  if(!req.isAuthenticated()){
    res.redirect('/');
  } else {
    Group.forge({id: req.params.id})
    .fetch({
      withRelated: ['users', 'users.exercises']
    })
    .then(function (group){
      console.log(group.toJSON().users[0].exercises[1]);
      Membership.forge({
        group_id: group.id,
        user_id: req.user.id
      })
      .fetch() //TODO: check for best practice, should be able to access by pivot
      .then(function (membership){
        if(membership){
          res.render('groups/show', {
            user_id: req.user.get('id'),
            membership: membership.toJSON().membership,
            group: group.toJSON()
          })
        }else{
          res.render('groups/show', {
            user_id: req.user.get('id'),
            membership: 'none',
            group: group.toJSON()
          })
        }
      })
    })
    .catch(function (error){
      console.log("errorrrrrrGView" + error.stack)
    })
  }
})
}

//GET
//renders create jade file in groups view
exports.createForm = function (req, res){
Users.fetch()
.then(function (data){
  if(!req.isAuthenticated()){
    res.redirect('/');
  } else {
    res.render('groups/create',{
      title: 'Create New Group',
      user_id: req.user.get('id')
    });
  }
})
}

//POST
//create group page
exports.submitGroup = function (req, res){
  Group.forge({
    name: req.body.name,
    description: req.body.description,
    start_date: req.body.start_date,
    end_date: req.body.end_date
    // exercise_length: req.body.exercise_length,
    // days_per_week: req.body.days_per_week
  })
  .save()
  .then(function (group) {
    Membership.forge({
      group_id: group.id,
      user_id: req.user.get('id'),
      membership: 'admin'
    })
    .save()
    .then(function (membership){
      req.method = 'get'; //TODO: is this necessary?
      res.redirect('/groups');
    })
  })
  .catch(function (error) {
    console.log("errorrrrrr" + error.stack);
  })
}

//GET
//renders the edit group page 
exports.editForm = function (req, res){
  Group.forge({id: req.params.id})
  .fetch()
  .then(function (data){
    res.render('groups/edit',{
      user_id: req.user.get('id'),
      title: 'Edit Group',
      data: data.toJSON()
    });
  })
  .catch(function (error){
    console.log("errorrrrrrGView" + error.stack)
  })
}

//POST
//updated group information saved to db by group id
exports.submitEdit = function (req, res){
  var id = req.params.id;
    Group.forge({id: id})
    .fetch({require: true})
    .then(function (group){
        group.save({
            name: req.body.name,
            description: req.body.description
        })
        .then(function (data){
            req.method = 'get';
            res.redirect(/group/ + id);
        })
        .catch(function (error) {
          console.log("errorrrrrr" + error.stack)
        })
    })
    .catch(function (error) {
    console.log("errorrrrrr" + error.stack)
  });
};

//POST
//deletes group by group id
exports.deleteOneGroup = function (req, res){
    Group.forge({id: req.params.id})
    .destroy()
    .then(function (group){
        req.method = 'get';
        res.redirect('/groups');
    })
    .catch(function (error) {
    console.log("errorrrrrr" + error.stack)
  });
};








