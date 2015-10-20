var bookshelf = require('../../database/schema');

var Group = bookshelf.Model.extend({
	tableName: 'groups',
	hasTimestamps: true,
	users: function(){
		return this.belongsToMany(User)
		.through(Role)
		.withPivot(['role']);
	}
});

module.exports = bookshelf.model('Group', Group);