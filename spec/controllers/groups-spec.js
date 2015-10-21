var request = require('request');
var Group = require('../../app/models/group');
var GroupsController = require('../../app/controllers/groups');


describe('GroupsController', function() {

  describe('tests without data', function() {

    // show groups list page
    it('should load the lists of groups on the page', function (done) {
      request('http://localhost:3000/groups', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    // show create group form
    it('should load the create group form', function (done) {
      request('http://localhost:3000/creategroup', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
    
    //create new group
    it('should create a new group', function (done) {
      var options = {
        url: 'http://localhost:3000/creategroup',
        form: {
          name: 'test group title',
          description: 'group description',
          exercise_length: 5,
          days_per_week: 7
        }
      };
      request.post(options, function (error, response, body) {
        expect(response.statusCode).toBe(302);
        new Group({
          name: 'test group title'
        })
        .fetch()
        .then(function(group) {
          expect(group.id).toBeDefined();
          new Group({
            id: group.id
          })
          .destroy()
          .then(function(){
            console.log("we have destroyed it--groups");
            done();
          })
          .catch(function(error) {
            console.log(error);
            done.fail(error);
          });
        })
        .catch(function(error){
          console.log("second error catch");
          done.fail(error);
        })
      });
    });
  });
  
  
 //  describe('tests with data', function() {
 //    var user;

 //    beforeEach(function(done) {
 //      new User({
 //        full_name: 'test name',
 //        password: 'test password',
 //        email: 'test@email.com2',
 //        bio: 'tell me bout you with data'
 //      })
 //      .save()
 //      .then(function(newUser) {
 //        user = newUser;
 //        done();
 //      });
 //    });

 //    afterEach(function(done) {
 //      new User({
 //        id: user.id
 //      }).destroy()
 //        .then(done)
 //        .catch(function(error) {
 //          done.fail(error);
 //        });
 //    });


 //    //login a user
 //    it('should login a user', function(done) {
 //      var options = {
 //        url: 'http://localhost:3000/login',
 //        form: {
 //          email: 'test@email.com',
 //          password: 'test password'
 //        }
 //      };

 //      request.post(options, function(error, response, body) {
 //        expect(response.statusCode).toBe(302);
 //        new User({
 //          id: user.id
 //        })
 //        .fetch()
 //        .then(function(user) {
 //          expect(user.id).toBeDefined();
 //          new User({
 //            id: user.id
 //          })
 //          .destroy();
 //          done();
 //        });
 //      });
 //    });
 // });
});