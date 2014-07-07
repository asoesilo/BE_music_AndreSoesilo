var app = require('../app');
var should = require('should');
var mongoose = require('mongoose');

// Get User model
var User = mongoose.model('User');

describe('User', function() {
  describe('#save()', function() {    
    beforeEach(function(done) {
      User.remove({}, done);
    });

    describe('valid parameters', function() {
      var user = new User({_id: 'user1'});

      it('should save without error', function(done) {
        user.save(done);
      });
    });

    describe('invalid parameters', function() {
      var user = new User();

      it('should throw an error', function(done) {
        user.save(function(err) {
          should.exist(err);
          done();
        });
      });
    });
  })
});