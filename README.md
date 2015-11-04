# Exercise App

The Exercise App is designed to help you stay motivated to exercise, by competing with friends to stick with it. You create a group, then invite your friends. Each person ponies up a bet price, logs their exercises, watches it play out on a leaderboard, and tries to take the prize. 

License: MIT

## Team
Technical Project Management - Jordan Hart, jordan@learntechlabs.com
Backend Development - Dechen Chuteng
Frontend Development and Design - Melody Schwartz

## Technologies Used
This app was built with Node, Express and Postgres. The views were done in Jade, and Bookshelf is the ORM on top of Knex as the query builder. Auth is handled with Passport and Bcrypt. Tests are run with Jasmine, and request is used to mock HTTP requests. Supertest was intended to mock the user sessions, but we couldn't get it working. 

## Setup
All requirements are included, so as long as you have Node and NPM installed, simply run an NPM install and you should be good to go. In database/schema.js the DB is configured to use environmental variables. You can either change these for your local config, or add environmental variables to your bash_profile.

Either way you'll need a local PSQL db running, with a user that has access to a database named 'exercise_app'. With DB configured, and requirements installed, you should be ready to run the app with 'node app.js'.

## How to Use
Create an account, create a group, log an exercise. You can then logout, create a new account, then logout and log back into the original account. Now you can invite that other user to your group, and see multiple users competiting on the leaderboard. 

## Current Limitations
We had issues integrating with some of the front end work that had been done, and the UI leaves much to be desired. That will be fixed, but we understand we will be graded on its current state. Similarly with Supertest not working, many tests fail. These are the two most important fixes. 

In addition we plan to refactor to modularize, secure, and refine much of the app. Routes need to be split out, foreign keys need to be noted in the schema, and routes need to be secured. 