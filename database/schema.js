var knex = require('knex')({
	client: 'pg',
	connection: {
		host: process.env.DATABASE_HOST,
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASS,
		database: 'exercise_app'
  }	
});

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
			user.timestamps();
		})
		.then(function (table){
			console.log('Created User Table', table);
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

//Role Column
bookshelf.knex.schema.hasTable('roles')
.then(function(exists){
	if(!exists){
		bookshelf.knex.schema.createTable('roles', function (role){
			role.increments('id').primary();
			role.integer('user_id', 255);
			role.integer('group_id', 255);
			role.string('role', 200).notNullable().defaultTo('guest');			
			role.boolean('invite_accepted');
			role.timestamps();
		})
		.then(function (table) {
			console.log('Created Role Table', table)
		}); 
	}
});


module.exports = bookshelf;
