var request = require('request');
var Exercise = require('../../app/models/exercise');
var ExercisesController = require('../../app/controllers/exercises');


describe('ExercisesController', function() {

  describe('tests without data', function() {
    
    //create new exercise
    it('should create a new exercise', function (done) {
      var options = {
        url: 'http://localhost:3000/createexercise',
        form: {
          name: 'test exercise title',
          description: 'exercise description',
          exercise_length: 5,
          days_per_week: 7,
          start_date: '2015-12-15',
          end_date: '2015-12-31'
        }
      };
      request.post(options, function (error, response, body) {
        expect(response.statusCode).toBe(302);
        new Exercise({
          name: 'test exercise title'
        })
        .fetch()
        .then(function(exercise) {
          expect(exercise.id).toBeDefined();
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
    var exercises;

    beforeEach(function(done) {
      new Exercise({
        name: 'test exercise title-with data',
        description: 'exercise description-withdata',
        exercise_length: 6,
        days_per_week: 8,
        start_date: '2015-12-15',
        end_date: '2015-12-31'
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
        url: 'http://localhost:3000/exercise/' + exercise.id + '/delete'
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