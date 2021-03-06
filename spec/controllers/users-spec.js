var request = require('request');
var User = require('../../app/models/user');
var UsersController = require('../../app/controllers/users');


describe('UsersController', function() {

  describe('tests without data', function() {

    // show login page
    it('should load the login form', function (done) {
      request('http://localhost:3000', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
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
    it('should login a user', function(done) {
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
    //TODO: refactor to make group id and user id dynamic
    it('should load user exercise log', function (done) {
      request('http://localhost:3000/group/1/user/18', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

  //   // //list users questions
  //   // it('should list a users questions', function(done) {
  //   //   request('http://localhost:3000/', function(error, response, body) {
  //   //     expect(response.statusCode).toBe(200);
  //   //     done();
  //   //   });
  //   // });

  //   //show
  //   it('should return a users profile', function(done){
  //     request('http://localhost:3000/user/' + user.id, function(error, response, body) {
  //       expect(response.statusCode).toBe(200);
  //       done();
  //     });
  //   });

  //   //edit user profile 
  //   it('should load the edit profile page', function (done) {
  //     request('http://localhost:3000/user/' + user.id + '/edit', function(error, response, body) {
  //       expect(response.statusCode).toBe(200);
  //       done();
  //     });
  //   });

  //   //update user profile
  //   it('should update a user profile', function(done) {
  //     var options = {
  //       url: 'http://localhost:3000/user/' + user.id + '/edit',
  //       form: {
  //         username: 'test username',
  //         password: 'test password',
  //         email: 'test@email.com',
  //         bio: 'tell me bout you'
  //       }
  //     };

  //     request.post(options, function(error, response, body) {
  //       expect(response.statusCode).toBe(302);
  //       new User({
  //         username: 'test username'
  //       })
  //       .fetch()
  //       .then(function(userCheck) {
  //         expect(userCheck.id).toBeDefined();
  //         done();
  //       });
  //     });
  //   });

  //   it('should delete a user', function (done) {
  //     var options = {
  //       url: 'http://localhost:3000/user/' + user.id + '/delete'
  //     };

  //     //TODO - check this style with Kirk, is there a better way?
  //     request.post(options, function(error, response, body) {
  //       expect(response.statusCode).toBe(302);
  //       var userCheck;
                
  //       new User({
  //         id: user.id
  //       })
  //       .fetch()
  //       .then(function (returnedUser){
  //         userCheck = user.id;
  //       });

  //       expect(userCheck).toBeUndefined();
  //       done();
  //     });
  //   });
    
  });
});