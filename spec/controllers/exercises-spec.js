var request = require('request');
var Exercise = require('../../app/models/exercise');
var ExercisesController = require('../../app/controllers/exercises');


describe('ExercisesController', function() {

  describe('tests without data', function() {
    
    //create new exercise log
    it('should create a new exercise log', function (done) {
      var options = {
        url: 'http://localhost:3000/exercise/create',
        form: {
          date:'2015-12-25',
          'req.user.id': 1
        }
      };

      request.post(options, function (error, response, body) {
        expect(response.statusCode).toBe(302);
        new Exercise({
          date:'2015-12-25'
        })
        .fetch()
        .then(function (exercise) {
          expect(exercise.get('id')).toBeDefined();
          new Exercise({
            id: exercise.id
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
    var exercise;
    beforeEach(function(done) {
      new Exercise({
        title: 'test title with data',
        description: 'test description with data',
        date:'2015-12-25',
        user_id: 1
      })
      .save()
      .then(function(newExercise) {
        exercise = newExercise;
        done();
      });
    });

    afterEach(function(done) {
      new Exercise({
        id: exercise.id
      }).destroy()
        .then(done)
        .catch(function(error) {
          done.fail(error);
        });
    });
    
    //delete a exercise
    it('should delete a exercise', function(done) {
      var options = {
        url: 'http://localhost:3000/exercise/1/delete/' + exercise.id
      };

      request.post(options, function(error, response, body) {
        expect(response.statusCode).toBe(302);
        new Exercise({
          id: exercise.id
        })
        .fetch()
        .then(function(deletedExercise) {
          expect(deletedExercise).toBeNull();
          done();
        });
      });
    });
 });
});