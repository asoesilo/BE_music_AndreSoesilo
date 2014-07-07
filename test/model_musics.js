var app = require('../app');
var mongoose = require('mongoose');
var should = require('should');

// Get Music model
var Music = mongoose.model('Music');

describe('Music', function() {
  describe('#save', function() {
    beforeEach(function(done) {
      Music.remove({}, done);
    });

    describe('valid parameters', function() {
      var music = new Music({_id: 'music1', genres: ['rock', 'jazz', 'funk']});

      it('should save without error', function(done) {
        music.save(done);
      });
    });

    describe('invalid parameters', function() {
      var music = new Music({_id: 'music2', genres: []});

      it('should throw an error', function(done) {
        music.save(function(err) {
          should.exist(err);
          done();
        });
      })
    });
  });
});