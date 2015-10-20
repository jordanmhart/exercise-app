var bookshelf = require('../../database/schema');

var Role = bookshelf.Model.extend({
	tableName: 'roles',
	hasTimestamps: true,
	roles: function(){
		return this.belongsTo(User);
	}
});

module.exports = bookshelf.model('Role', Role);