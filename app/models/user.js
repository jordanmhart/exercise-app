var bookshelf = require('../../database/schema');

var User = bookshelf.Model.extend({
	tableName: 'users',
	hasTimestamps: true,
	groups: function(){
		return this.hasMany('Group', 'group_id');
		//check in with Kirk/Clark for many to many
	},
	exercises: function(){
		return this.hasMany('Exercise', 'exercise_id');
	}
});

module.exports = bookshelf.model('User', User);