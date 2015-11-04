var bookshelf = require('../../database/schema');
var User = require('../models/user');

var Users = new bookshelf.Collection();

Users.model = User;

module.exports = Users;
