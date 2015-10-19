var knex = require('knex')({
	client: 'pg',
	connection: {
    host     : 'localhost',
    database : 'exercise_app'
  }	
})

var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry');

//User Column
bookshelf.knex.schema.hasTable('users')
.then(function(exists){
	if(!exists){
		bookshelf.knex.schema.createTable('users', function (user){
			user.increments('id').primary();
			user.string('full_name', 300).notNullable().defaultTo('');
			user.string('email', 250).unique().notNullable().defaultTo('');
			user.string('password', 150).notNullable();
			user.text('bio', 1000).notNullable().defaultTo('');
			user.string('photo_url').notNullable().defaultTo('');
			user.string('role', 200).notNullable().defaultTo('guest');
			user.timestamps();
		})
		.then(function (table){
			console.log('Created User Table', table)
		});
	}
});


//Group Column
bookshelf.knex.schema.hasTable('groups')
.then(function(exists){
	if(!exists){
		bookshelf.knex.schema.createTable('groups', function (group){
			group.increments('id').primary();
			group.string('name',150).unique().notNullable().defaultTo('');
			group.text('description', 2000).unique().notNullable().defaultTo('');
			group.string('stage',150).unique().notNullable().defaultTo('');
			group.date('start_date',150).unique().notNullable();
			group.date('end_date',150).unique().notNullable();
			group.integer('exercise_length',100).unique().notNullable().defaultTo(30);
			group.integer('days_per_week',100).unique().notNullable().defaultTo(5);
			group.timestamps();
		})
		.then(function (table) {
			console.log('Created Group Table', table)
		}); 
	}
});

//Exercise Column
bookshelf.knex.schema.hasTable('exercises')
.then(function(exists){
	if(!exists){
		bookshelf.knex.schema.createTable('exercises', function (exercise){
			exercise.increments('id').primary();
			exercise.string('title', 150);
			exercise.text('description', 2000).unique().notNullable().defaultTo('');
			exercise.dateTime('start_time',150);
			exercise.dateTime('end_time', 150);
			exercise.integer('user_id',255);
			exercise.timestamps();
		})
		.then(function (table) {
			console.log('Created Exercise Table', table)
		}); 
	}
});

//User to Group Column
bookshelf.knex.schema.hasTable('users_to_groups')
.then(function(exists){
	if(!exists){
		bookshelf.knex.schema.createTable('users_to_groups', function (user_to_group){
			user_to_group.increments('id').primary();
			user_to_group.integer('user_id', 255);
			user_to_group.integer('group_id', 255);
			user_to_group.boolean('invite_accepted');
			user_to_group.timestamps();
		})
		.then(function (table) {
			console.log('Created User to Group Table', table)
		}); 
	}
});


module.exports = bookshelf;
