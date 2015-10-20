var bookshelf = require('../../database/schema');
var Group = require('../models/group');

var Groups = new bookshelf.Collection();

Groups.model = Group;

module.exports = Groups;
