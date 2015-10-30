//models
var Exercise = require('../models/exercise');
var User = require('../models/user')
//collections
var Exercises = require('../collections/exercises');

//GET
exports.index = function(req, res){
  res.render('exercises/index');
}
//POST
//create exercise page
exports.create = function (req, res){
  var id = req.params.id,
    user_id = User.id;
  Exercise.forge({
    title: req.body.title,
    date: req.body.date,
    user_id: user_id
  })
  .save()
  .then( function (data) {
    req.method = 'get';
    res.redirect('/exercises');
  })
  .catch(function (error) {
    console.log("errorrrrrr" + error.stack)

  })
}

//POST
//deletes exercise by exercise id
exports.destroy = function (req, res){
    var id = req.params.id;
    Exercise.forge({id: id})
    .destroy()
    .then(function (exercise){
        req.method = 'get';
        res.redirect('/exercises');
    })
    .catch(function (error) {
    console.log("errorrrrrr" + error.stack)
  });
};


