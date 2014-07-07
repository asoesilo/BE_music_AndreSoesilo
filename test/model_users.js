var app = require('../app');
var should = require('should');
var async = require('async');
var _ = require('underscore');
var mongoose = require('mongoose');

// Get User model
var User = mongoose.model('User');

// Get Music model
var Music = mongoose.model('Music');

describe('User', function() {
  describe('#save', function() {    
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
  });

  describe('#addFollowee', function() {
    var user = new User({_id: 'user1'});
    var followee = new User({_id: 'followee1'});

    beforeEach(function(done) {
      async.each([user, followee], function(item, callback) {
        item.save(callback);
      }, function(err) {
        done(err);
      });
    });

    afterEach(function(done) {
      async.each([user, followee], function(item, callback) {
        item.remove(callback);
      }, function(err) {
        done(err);
      });
    });

    describe('new followee', function() {
      var count;
      var error;

      before(function(done) {
        count = user.followees.length;
        user.addFollowee(followee, function(err) {
          error = err;
          done();
        });
      });

      it('increases followee count by one', function(done) {
        (user.followees.length).should.equal(count + 1);
        done();
      });

      it('does not return an error', function(done) {
        should.not.exist(error);
        done();
      });

      describe('add existing followee', function() {
        before(function(done) {
          count = user.followees.length;
          user.addFollowee(followee, function(err) {
            done();
          });
        });

        it('does not increase followee count', function(done) {
          (user.followees.length).should.equal(count);
          done();
        });
      });
    });

    describe('invalid followee parameter', function() {
      var error;

      before(function(done) {
        user.addFollowee({}, function(err) {
          error = err;
          done();
        });
      });

      it('returns an error', function(done) {
        should.exist(error);
        done();
      });
    });
  });

  describe('#addMusic', function() {
    var user = new User({_id: 'user1'});
    var music1 = new Music({_id: 'music1', genres: ['jazz', 'funk']});
    var music2 = new Music({_id: 'music2', genres: ['jazz', 'funk', 'classic']});

    beforeEach(function(done) {
      async.each([user, music1, music2], function(item, callback) {
        item.save(callback);
      }, function(err) {
        done(err);
      });
    });

    afterEach(function(done) {
      async.each([user, music1, music2], function(item, callback) {
        item.remove(callback);
      }, function(err) {
        done(err);
      });
    });

    describe('add music with new genres', function() {
      var error;
      var musicCount;
      var musicGenresCount;

      before(function(done) {
        musicCount = user.musicListened.length;
        musicGenresCount = user.musicGenresListened.length;

        user.addMusic(music1, function(err) {
          error = err;
          done();
        });
      });

      it('should not return an error', function(done) {
        should.not.exist(error);
        done();
      });

      it('increases music count by one', function(done) {
        (user.musicListened.length).should.equal(musicCount + 1);
        done();
      });

      it('increases music genres listened count', function(done) {
        (user.musicGenresListened.length).should.equal(musicGenresCount + music1.genres.length);
        done();
      });

      it('adds all music genres to list of genres listened with count of one', function(done) {
        music1.genres.forEach(function(name) {
          var genre = _.find(user.musicGenresListened, function(element) {
            return element.genreName === name;
          });
          should.exist(genre);
          (genre.count).should.equal(1);
        });
        done();
      });

      describe('add new music with existing genres and one new genre', function() {
        before(function(done) {
          musicCount = user.musicListened.length;
          musicGenresCount = user.musicGenresListened.length;

          user.addMusic(music2, function(err) {
            error = err;
            done();
          });
        });

        it('increases music genres listened count by one', function(done) {
          (user.musicGenresListened.length).should.equal(musicGenresCount + 1);
          done();
        });

        it('increases existing genres listened count by one and set non-existing genres listened count to one', 
          function(done) {
            music2.genres.forEach(function(name) {
              var genre = _.find(user.musicGenresListened, function(element) {
                return element.genreName === name;
              });
              should.exist(genre);
              if(music1.genres.indexOf(name) >= 0) {
                // Existing genre
                (genre.count).should.equal(2);
              }
              else {
                (genre.count).should.equal(1); 
              }
            });
            done();
          }
        );
      });
    });

    describe('invalid music parameter', function() {
      var error;

      before(function(done) {
        user.addMusic({}, function(err) {
          error = err;
          done();
        });
      });

      it('returns an error', function(done) {
        should.exist(error);
        done();
      });
    });
  });
});