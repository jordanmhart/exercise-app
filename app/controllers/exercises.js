//models
var Exercise = require('../models/exercise');
var User = require('../models/user');

//collections
var Exercises = require('../collections/exercises');

//POST
//create exercise page
exports.logExercise = function (req, res){
  var group_id = req.params.group_id;
  var date = req.params.date;
  var user_id = req.user.id;

  Exercise.forge({
    date: date,
    user_id: user_id
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
//deletes exercise by exercise id
exports.deleteExercise = function (req, res){
  var group_id = req.params.group_id;
  var id = req.params.id;
    Exercise.forge({id: id})
    .destroy()
    .then(function (exercise){
      req.method = 'get';
      res.redirect('/group/' + group_id);
    })
    .catch(function (error) {
    console.log("errorrrrrr" + error.stack)
  });
}


