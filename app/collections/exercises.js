var bookshelf = require('../../database/schema');
var Exercise = require('../models/exercise');

var Exercises = new bookshelf.Collection();

Exercises.model = Exercise;

module.exports = Exercises;
