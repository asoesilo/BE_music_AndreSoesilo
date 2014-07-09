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

  it('test', function(done) {
    done();
  });
});