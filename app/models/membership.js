var bookshelf = require('../../database/schema');

var Membership = bookshelf.Model.extend({
    tableName: 'memberships',
    hasTimestamps: true,
    user: function(){
        return this.belongsTo('User');
    },
    group: function(){
        return this.belongsTo('Group');
    }
});

module.exports = bookshelf.model('Membership', Membership);