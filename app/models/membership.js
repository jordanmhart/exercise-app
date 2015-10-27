var bookshelf = require('../../database/schema');

// var Membership = bookshelf.Model.extend({
//     user: function(){
//         return this.belongsTo(User);
//     }
//     group: function(){
//         return this.belongsTo(Group);
//     }
// });

var Membership = bookshelf.Model.extend({
	tableName: 'memberships',
	hasTimestamps: true,
	memberships: function(){
		return this.belongsTo(User);
	}
});

module.exports = bookshelf.model('Membership', Membership);