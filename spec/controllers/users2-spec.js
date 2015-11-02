// var request = require('request');
var session = require('supertest-session');
var exerciseApp = require('../../app');
var User = require('../../app/models/user');
var UsersController = require('../../app/controllers/users');

var testSession = null;

describe('UsersController', function() {


  describe('tests without data', function() {
    beforeEach(function() {
      testSession = session(exerciseApp);
    });
    
    // show login page
    it('should load the login form', function (done) {
      console.log(testSession);
      testSession.get('/')
      .expect(200)
      .end(function (err, res) {
        if (err){
          done.fail(err);
        } else {
          done();
        }
      });
    });


    // show registration form
    it('should load the registration form', function (done) {
      request('http://localhost:3000/register', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
    
    //create new user
    it('should register a new user', function(done) {
      var options = {
        url: 'http://localhost:3000/register',
        form: {
          full_name: 'test full_name',
          initials: 'test',
          email: 'test@email.com',
          password: 'test password',
          bio: 'tell me bout you no data'
        }
      };


      request.post(options, function(error, response, body) {
        expect(response.statusCode).toBe(302);
        new User({
          email: 'test@email.com'
        })
        .fetch()
        .then(function(createdUser) {
          expect(createdUser.id).toBeDefined();
          new User({
            id: createdUser.id
          })
          .destroy();
          done();
        });
      });
    });
  });

  
  describe('tests with data', function() {
    var user;

    beforeEach(function(done) {
      testSession = session(exerciseApp);

      new User({
        full_name: 'test full_name',
        initials: 'test',
        password: 'test password',
        email: 'test@email.com2',
        bio: 'tell me bout you with data'
      })
      .save()
      .then(function(newUser) {
        user = newUser;
        done();
      });
    });

    afterEach(function(done) {
      new User({
        id: user.id
      }).destroy()
        .then(done)
        .catch(function(error) {
          done.fail(error);
        });
    });


    //login a user
    //TODO: ask Kirk why we get an error, which leads to rendering the index
    //instead of /groups
    it('should login a user', function (done) {
      var options = {
        url: 'http://localhost:3000/login',
        form: {
          email: 'test@email.com2',
          password: 'test password'
        }
      };

      request.post(options, function(error, response, body) {
        expect(response.statusCode).toBe(302);
        new User({
          id: user.id
        })
        .fetch()
        .then(function(user) {
          expect(user.id).toBeDefined();
          new User({
            id: user.id
          })
          .destroy();
          done();
        });
      });
    });
    // TODO: refactor to make group id and user id dynamic
    it('should load user exercise log', function (done) {
      testSession.get('/', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
  });
});