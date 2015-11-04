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
          role: 'member'
        }
      };

      request.post(options, function (error, response, body) {
        expect(response.statusCode).toBe(302);
        new Membership({
          role: 'member'
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
    var membership_member;
    var membership_admin;

    beforeEach(function(done) {
      new Membership({
        user_id: 1,
        group_id: 2,
        role: 'member'
      })
      .save()
      .then(function(newMembership) {
        membership_member = newMembership.toJSON();
        done();
      });
      
      new Membership({
        user_id: 3,
        group_id: 2,
        role: 'admin'
      })
      .save()
      .then(function(newMembership) {
        membership_admin = newMembership.toJSON();
        done();
      });
    });

    afterEach(function(done) {
      new Membership({
        id: membership_member.id
      })
      .destroy()
      .then(done)
      .catch(function(error) {
        done.fail(error);
      });
      
      new Membership({
        id: membership_admin.id
      })
      .destroy()
      .then(done)
      .catch(function(error) {
        done.fail(error);
      });
    });
    
    //delete a membership
    it('should delete a membership', function(done) {
      var options = {
        url: 'http://localhost:3000/membership/' + membership_member.group_id + '/' + membership_member.user_id + '/delete'
      };

      request.post(options, function(error, response, body) {
        expect(response.statusCode).toBe(302);
        new Membership({
          id: membership_member.id
        })
        .fetch()
        .then(function(deletedMembership) {
          expect(deletedMembership).toBeNull();
          done();
        });
      });
    });

    //admin promotes user to admin
    it('should promote user to admin', function(done) {
      var options = {
        url: 'http://localhost:3000/membership/' + membership_member.group_id + '/' + membership_member.user_id + '/promote'
      };

      request.post(options, function(error, response, body) {
        expect(response.statusCode).toBe(302);
        new Membership({
          id: membership_member.id
        })
        .fetch()
        .then(function(membership) {
          expect(membership.toJSON().role).toBe('admin');
          done();
        });
      });
    });

    //admin demotes user to member
    it('should demote user to member', function(done) {
      var options = {
        url: 'http://localhost:3000/membership/' + membership_admin.group_id + '/' + membership_admin.user_id + '/demote'
      };

      request.post(options, function(error, response, body) {
        expect(response.statusCode).toBe(302);
        new Membership({
          id: membership_admin.id
        })
        .fetch()
        .then(function(membership) {
          expect(membership.toJSON().role).toBe('member');
          done();
        });
      });
    });
 });
});