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
exports.create = function (req, res){
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
// exports.destroy = function (req, res){
//     var group_id = req.params.id;

//     Membership.forge({id: id})
//     .destroy()
//     .then(function (membership){
//         req.method = 'get';
//         res.redirect('/group/' + group_id);
//     })
//     .catch(function (error) {
//     console.log("errorrrrrr" + error.stack)
//   });
// };
