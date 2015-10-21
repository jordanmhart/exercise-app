//models
var Group = require('../models/group');

//collections
var Groups = require('../collections/groups');

//GET
//loads index page of groups -- list of groups
exports.index = function(req, res){
	res.render('groups/index');
}

//GET
//renders create jade file in groups view
exports.creategroup = function (req, res){
	res.render('groups/create',{
		title: 'Create New Group'
	});
}

//POST
exports.create = function (req, res){
  Group.forge({
    name: req.body.name,
    description: req.body.description,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    exercise_length: req.body.exercise_length,
    days_per_week: req.body.days_per_week
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