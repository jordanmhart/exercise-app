//models
var Group = require('../models/group');

//collections
var Groups = require('../collections/groups');

//GET
//loads index page of groups -- list of groups
exports.index = function(req, res){    
  Groups.fetch()
  .then(function (data){
    res.render('groups/index',{
    title: 'My Groups',
    data: data.toJSON()
    })
  })
  .catch(function (error) {
    console.log("errorrrrrr" + error.stack)
  })
  }

//GET
//renders create jade file in groups view
exports.createForm = function (req, res){
	res.render('groups/create',{
		title: 'Create New Group'
	});
}

//POST
//create group page
exports.create = function (req, res){
  Group.forge({
    name: req.body.name,
    description: req.body.description,
    start_date: req.body.start_date,
    end_date: req.body.end_date
    // exercise_length: req.body.exercise_length,
    // days_per_week: req.body.days_per_week
  })
  .save()
  .then(function (data) {
    req.method = 'get';
    res.redirect('/groups');
  })
  .catch(function (error) {
    console.log("errorrrrrr" + error.stack);
  })
}

//GET
//when clicked, views a single group
exports.show = function (req, res){
  Group.forge({id: req.params.id})
  .fetch({
    withRelated: ['users']
  })
  .then(function (data){
    res.render('groups/show', {
      data: data.toJSON()
    })
  })
  .catch(function (error){
    console.log("errorrrrrrGView" + error.stack)
  })
}


//GET
//renders the edit group page 
exports.edit = function (req, res){
    res.render('groups/edit',{
        title: 'Edit Group'
    });
}

//POST
//updated group information saved to db by group id
exports.update = function (req, res){
    Group.forge({id: req.params.id})
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
exports.destroy = function (req, res){
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








