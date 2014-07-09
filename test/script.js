var app = require('../app');
var request = require('supertest');
var should = require('should');
var follows = require('./helpers/load_follows');
var listen = require('./helpers/load_listen');

describe('Script', function() {
  before(function(done) {
    follows.load(function(err) {
      if(err) {
        return done(err);
      }
      listen.load(done);
    });
  });

  it('get recommended list of music', function(done) {
    var userID = 'a';

    request(app)
      .get('/recommendations')
      .send({user: userID})
      .end(function(err, req) {
        if(err) {
          return done(err);
        }

        console.log("The recommended music list is:");
        console.log(req.body.list);
        done();
      });
  });
});