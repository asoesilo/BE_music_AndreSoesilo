var app = require('../app');
var request = require('supertest');
var should = require('should');
var follows = require('./helpers/load_follows');
var listen = require('./helpers/load_listen');

describe('Script', function() {
  // Loads the follows.json and listen.json
  before(function(done) {
    // Loads the list of followers and followees
    follows.load(function(err) {
      if(err) {
        return done(err);
      }

      // Loads the list of music that users has listened to
      listen.load(done);
    });
  });

  // Get the list of music recommendation for user 'a'
  it('get recommended list of music', function(done) {
    var userID = 'a';

    // Send out the GET /recommendations request
    request(app)
      .get('/recommendations')
      .send({user: userID})
      .end(function(err, req) {
        if(err) {
          return done(err);
        }

        // Display the recommended music list
        console.log("The recommended music list is:");
        console.log(req.body.list);
        done();
      });
  });
});