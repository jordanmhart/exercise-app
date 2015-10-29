var request = require('request');
var Membership = require('../../app/models/membership');
var MembershipsController = require('../../app/controllers/memberships');


describe('MembershipsController', function() {

  describe('tests without data', function() {
    
    //create new membership for the user
    it('should create a new membership', function (done) {
      var options = {
        url: 'http://localhost:3000/group/1/invite',
        form: {
          user_id: 1,
          membership: 'invitee'
        }
      };

      request.post(options, function (error, response, body) {
        expect(response.statusCode).toBe(302);
        new Membership({
          membership: 'invitee'
        })
        .fetch()
        .then(function (membership) {
          expect(membership.get('id')).toBeDefined();
          new Membership({
            id: membership.id
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
    var membership;
    beforeEach(function(done) {
      new Membership({
        user_id: 1,
        group_id: 2,
        membership: 'member'
      })
      .save()
      .then(function(newMembership) {
        membership = newMembership.toJSON();
        done();
      });
    });

    afterEach(function(done) {
      new Membership({
        id: membership.id
      }).destroy()
        .then(done)
        .catch(function(error) {
          done.fail(error);
        });
    });
    
    //delete a membership
    it('should delete a membership', function(done) {
      var options = {
        url: 'http://localhost:3000/membership/' + membership.group_id + '/' + membership.user_id + '/delete'
      };

      request.post(options, function(error, response, body) {
        expect(response.statusCode).toBe(302);
        new Membership({
          id: membership.id
        })
        .fetch()
        .then(function(deletedMembership) {
          expect(deletedMembership).toBeNull();
          done();
        });
      });
    });
 });
});