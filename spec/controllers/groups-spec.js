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
      request('http://localhost:3000/group/create', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
    
    //create new group
    it('should create a new group', function (done) {
      var options = {
        url: 'http://localhost:3000/group/create',
        form: {
          name: 'test group title',
          description: 'group description',
          exercise_length: 5,
          days_per_week: 7,
          start_date: '2015-12-15',
          end_date: '2015-12-31'
        }
      };
      request.post(options, function (error, response, body) {
        expect(response.statusCode).toBe(302);
        new Group({
          name: 'test group title'
        })
        .fetch()
        .then(function (group) {
          expect(group.id).toBeDefined();
          new Group({
            id: group.id
          })
          .destroy()
          .then(function(){
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
  
  
  describe('tests with data', function() {
    var group;

    beforeEach(function(done) {
      new Group({
        name: 'test group title-with data',
        description: 'group description-withdata',
        start_date: '2015-12-15',
        end_date: '2015-12-31'
      })
      .save()
      .then(function(newGroup) {
        group = newGroup;
        done();
      });
    });

    afterEach(function(done) {
      new Group({
        id: group.id
      }).destroy()
        .then(done)
        .catch(function(error) {
          done.fail(error);
        });
    });

    //show group page
    //TODO: Ask Kirk how to test for users and exercises to be defined
    //TODO: split the three expects into three tests(code review)
    it('should load the group page', function (done) {
      request('http://localhost:3000/group/' + group.id, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        // expect(data.users).toBeDefined();
        // expect(data.users.exercises).toBeDefined();
        done();
      });
    });

    //show edit group form
    it('should load the edit group form', function (done) {
      request('http://localhost:3000/group/' + group.id + '/edit', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
    

    //update a group
    it('should update a group', function(done) {
      var options = {
        url: 'http://localhost:3000/group/' + group.id + '/edit',
        form: {
          name: 'updated group title',
          description: 'updated group description',
          start_date: '2015-12-15',
          end_date: '2015-12-31'
        }
      };

      request.post(options, function(error, response, body) {
        expect(response.statusCode).toBe(302);
        new Group({
          id: group.id
        })
        .fetch()
        .then(function(group) {
          expect(group.id).toBeDefined();
          new Group({
            id: group.id
          })
          .destroy();
          done();
        });
      });
    });
    
    //delete a group
    it('should delete a group', function(done) {
      var options = {
        url: 'http://localhost:3000/group/' + group.id + '/delete'
      };

      request.post(options, function(error, response, body) {
        expect(response.statusCode).toBe(302);
        new Group({
          id: group.id
        })
        .fetch()
        .then(function(deletedGroup) {
          expect(deletedGroup).toBeNull();
          done();
        });
      });
    });
 });
});