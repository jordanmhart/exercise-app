var bookshelf = require('../../database/schema');
var Membership = require('../models/membership');

var Memberships = new bookshelf.Collection();

Memberships.model = Membership;

module.exports = Memberships;