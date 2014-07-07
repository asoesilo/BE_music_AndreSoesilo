var app = require('../app');
var mongoose = require('mongoose');
var request = require('supertest');
var should = require('should');
var async = require('async');
var User = mongoose.model('User');
var Music = mongoose.model('Music');

describe('POST /listen', function() {
  var user = new User({_id: 'user'});
  var music = new Music({_id: 'music', genres: ['jazz', 'funk']});
  var otherMusic = new Music({_id: 'other', genres: ['jazz', 'funk']});

  before(function(done) {
    async.each([user, music], function(item, callback) {
      item.save(callback);
    }, function(err) {
      return done(err);
    });
  });

  after(function(done) {
    async.each([user, music], function(item, callback) {
      item.remove(callback);
    }, function(err) {
      return done(err);
    });
  });

  // Returns a function that validates the specified music's ID
  // either exists or not exists in the user's list
  // If expected is true, validate for existence; Otherwise,
  // validate for non-existence
  var userContainsMusicID = function(expected, musicID) {
    return function() {
      User.findOne({_id: user._id}, function(err, user) {
        should.not.exist(err);
        if(expected) {
          (user.musicListened).should.containEql(musicID);
        }
        else {
          (user.musicListened).should.not.containEql(musicID);
        }
      });
    };
  }

  describe('valid parameters', function() {
    it("adds music to user's list", function(done) {
      request(app)
        .post('/listen')
        .send({user: user._id, music: music._id})
        .expect(200)
        .expect(userContainsMusicID(true, music._id))
        .end(done);
    });
  });

  describe('invalid parameters', function() {
    it("does not add music to user's list", function(done) {
      request(app)
        .post('/listen')
        .send({user: user._id, music: otherMusic._id})
        .expect(400)
        .expect(userContainsMusicID(false, otherMusic._id))
        .end(done);
    });
  });
});