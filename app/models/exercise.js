var bookshelf = require('../../database/schema');

var Exercise = bookshelf.Model.extend({
	tableName: 'exercises',
	hasTimestamps: true,
	groups: function(){
		return this.hasMany('Group', 'group_id');
	},
	users: function(){
		return this.hasMany('User', 'user_id');
	}
});

module.exports = bookshelf.model('Exercise', Exercise);