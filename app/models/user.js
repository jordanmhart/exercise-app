var bookshelf = require('../../database/schema');

var User = bookshelf.Model.extend({
	tableName: 'users',
	hasTimestamps: true,
	groups: function(){
		return this.belongsToMany(Group)
		.through(Membership)
		.withPivot(['membership']);
	},
	exercises: function(){
		return this.hasMany(Exercise, 'user_id');
	}
});

module.exports = bookshelf.model('User', User);