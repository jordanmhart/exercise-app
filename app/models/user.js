var bookshelf = require('../../database/schema');
// var Exercise = require('./exercise');

// var User = bookshelf.Model.extend({
// 	groups: function(){
// 		return this.belongsToMany(Group)
// 		.through(Membership);
// 	},
// 	exercises: function(){
// 		return this.hasMany(Exercise, 'user_id');
// 	}
// });

var User = bookshelf.Model.extend({
	tableName: 'users',
	hasTimestamps: true,
	groups: function(){
		return this.belongsToMany('Group')
		.through('Membership')
		.withPivot(['role']);
	},
	exercises: function(){
		return this.hasMany('Exercise', 'user_id');
	}
});

module.exports = bookshelf.model('User', User);