var bookshelf = require('../../database/schema');
var Role = require('../models/role');

var Roles = new bookshelf.Collection();

Roles.model = Role;

module.exports = Roles;