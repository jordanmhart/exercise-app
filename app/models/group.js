var bookshelf = require('../../database/schema');

var Group = bookshelf.Model.extend({
	tableName: 'groups',
	hasTimestamps: true,
	users: function(){
		return this.belongsToMany(User)
		.through(membership)
		.withPivot(['membership']);
	}
});

module.exports = bookshelf.model('Group', Group);