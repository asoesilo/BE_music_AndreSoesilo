var app = require('../app');
var should = require('should');
var request = require('supertest');
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');

describe('POST /follow', function() {
  var from = new User({_id: 'from'});
  var to = new User({_id: 'to'});
  var otherUser = new User({_id: 'other'});

  before(function(done) {
    async.each([from, to], function(item, callback) {
      item.save(callback);
    }, function(err) {
      return done(err);
    });
  });

  after(function(done) {
    async.each([from, to], function(item, callback) {
      item.remove(callback);
    }, function(err) {
      return done(err);
    });
  });

  // Returns a function that validates the specified followee's ID
  // either exists or not exists in the user's list
  // If expected is true, validate for existence; Otherwise,
  // validate for non-existence
  var userContainsFolloweeID = function(expected, followeeID) {
    return function() {
      User.findOne({_id: from._id}, function(err, user) {
        should.not.exist(err);
        if(expected) {
          user.followees.should.containEql(followeeID);
        }
        else {
          user.followees.should.not.containEql(followeeID);
        }
      });
    }
  };

  describe('valid parameters', function() {
    it('adds followee into user list of followee', function(done) {
      request(app)
        .post('/follow')
        .send({from: from._id, to: to._id})
        .expect(200)
        .expect(userContainsFolloweeID(true, to._id))
        .end(done);
    });
  });

  describe('invalid parameters', function() {
    it('does not add followee into user list of followee', function(done) {
      request(app)
        .post('/follow')
        .send({from: from._id, to: otherUser._id})
        .expect(400)
        .expect(userContainsFolloweeID(false, otherUser._id))
        .end(done);
    });
  });
});