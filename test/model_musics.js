var app = require('../app');
var mongoose = require('mongoose');
var should = require('should');

// Get Music model
var db = mongoose.connection;
var Music = mongoose.model('Music');

describe('Music', function() {
  var currentMusic = null;

  describe('#save()', function() {
    beforeEach(function(done) {
      Music.remove({}, function(err) {
        if(err) {
          return done(err);
        }
        return done();
      });
    });

    describe('valid parameters', function() {
      var music = new Music({_id: 'music1', categories: ['rock', 'jazz', 'funk']});

      it('should save without error', function(done) {
        music.save(done);
      });
    });

    describe('invalid parameters', function() {
      var music = new Music({_id: 'music2', categories: []});

      it('should throw an error', function(done) {
        music.save(function(err) {
          should.exist(err);
          done();
        });
      })
    });
  });
});