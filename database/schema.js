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
			user.string('full_name', 300);
			user.string('initials', 4).notNullable();
			user.string('email', 250).unique().notNullable();
			user.string('password', 150).notNullable();
			user.text('bio', 1000);
			user.string('photo_url');
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
			group.string('name', 150).notNullable();
			group.text('description', 2000);
			group.string('stage', 150).notNullable().defaultTo('draft');
			group.date('start_date').notNullable();
			group.date('end_date').notNullable();
			// group.integer('exercise_length').notNullable().defaultTo(30);
			// group.integer('days_per_week').notNullable().defaultTo(5);
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
			exercise.text('description', 2000);
			exercise.date('date').notNullable();
			exercise.time('start_time');
			exercise.time('end_time');
			exercise.integer('user_id', 255).notNullable();
			exercise.timestamps();
		})
		.then(function (table) {
			console.log('Created Exercise Table', table)
		}); 
	}
});

//Membership Column
bookshelf.knex.schema.hasTable('memberships')
.then(function(exists){
	if(!exists){
		bookshelf.knex.schema.createTable('memberships', function (membership){
			membership.increments('id').primary();
			membership.integer('user_id', 255);
			membership.integer('group_id', 255);
			membership.string('membership', 200).notNullable().defaultTo('invitee');			
			membership.timestamps();
		})
		.then(function (table) {
			console.log('Created Membership Table', table)
		}); 
	}
});


module.exports = bookshelf;
