var app = require('../app');
var should = require('should');
var MusicRecommendationEngine = require('../lib/music_recommendation_engine');
var mongoose = require('mongoose');
var User = mongoose.model('User');

describe('MusicRecommendationEngine', function() {
  describe('#getMusicRecommendations', function() {
    var user = new User({_id: 'user1'});
    var error;
    var musicList;

    before(function(done) {
      user.save(function(err) {
        if(err) {
          return done(err);
        }

        MusicRecommendationEngine.getMusicRecommendations(user, function(err, list) {
          error = err;
          musicList = list;
          done();
        });
      });
    });

    after(function(done) {
      user.remove(done);
    });

    it('does not return an error', function(done) {
      should.not.exist(error);
      done();
    });

    it('returns list of five songs', function(done) {
      (musicList.length).should.equal(5);
      done();
    });
  });
});