var app = require('../app');
var mongoose = require('mongoose');
var request = require('supertest');
var should = require('should');
var User = mongoose.model('User');

describe('GET /recommendations', function() {
  var user = new User({_id: 'user1'});
  var otherUser = new User({_id: 'other'});

  before(function(done) {
    user.save(done);
  });

  after(function(done) {
    user.remove(done);
  });

  describe('valid parameters', function() {
    var list;
    var error;
    var status;

    before(function(done) {
      request(app)
        .get('/recommendations')
        .send({user: user._id})
        .end(function(err, res) {
          if(err) {
            return done(err);
          }

          list = res.body.list;
          error = res.body.error;
          status = res.status;
          done();
        });
    });

    it('returns HTTP OK(200)', function(done) {
      status.should.equal(200);
      done();
    });

    it('does not return an error', function(done) {
      should.not.exist(error);
      done();
    });

    it('returns list of five music', function(done) {
      (list.length).should.equal(5);
      done();
    });
  });

  describe('invalid parameters', function() {
    var list;
    var error;
    var status;

    before(function(done) {
      request(app)
        .get('/recommendations')
        .send({user: otherUser._id})
        .end(function(err, res) {
          if(err) {
            return done(err);
          }

          list = res.body.list;
          error = res.body.error;
          status = res.status;
          done();
        });
    });

    it('returns HTTP 400', function(done) {
      status.should.equal(400);
      done();
    });

    it('receives an error message', function(done) {
      should.exist(error);
      done();
    });

    it('does not return list of five music', function(done) {
      should.not.exist(list);
      done();
    });
  });
});