var app = require('../../app');
var _ = require('underscore');
var async = require('async');
var request = require('supertest');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var data = require('../../json/follows').operations;

var clearUsers = function(next) {
  User.remove({}, next);
};

var loadUsers = function(next) {
  var usernames = _.flatten(data);
  usernames = _.uniq(usernames);

  async.each(usernames, function(username, done) {
    var user = new User({_id: username});
    user.save(done);
  }, function(err) {
    next(err);
  });
};

var loadFollows = function(next) {
  async.each(data, function(pair, done) {
    var from = pair[0];
    var to = pair[1];

    request(app)
      .post('/follow')
      .send({from: from, to: to})
      .end(done);
  }, function(err) {
    next(err);
  });
};

var load = function(next) {
  clearUsers(function(err) {
    if(err) {
      return next(err);
    }

    loadUsers(function(err) {
      if(err) {
        return next(err);
      }

      loadFollows(function(err) {
        next(err);
      });
    });
  })
};

module.exports.load = load;