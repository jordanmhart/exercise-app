var bookshelf = require('../../database/schema');

var Group = bookshelf.Model.extend({
	tableName: 'groups',
	hasTimestamps: true,
	users: function(){
		return this.hasMany('User', 'user_id');
		//check in with Kirk/Clark for many to many
	}
});

module.exports = bookshelf.model('Group', Group);