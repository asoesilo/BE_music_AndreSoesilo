var app = require('../app');
var mongoose = require('mongoose');
var should = require('should');

// Get Music model
var Music = mongoose.model('Music');

describe('Music', function() {

  describe('#save', function() {
    describe('valid parameters', function() {
      var music = new Music({_id: 'music1', genres: ['rock', 'jazz', 'funk']});

      after(function(done) {
        Music.findOne({_id: music._id}).remove(done);
      });

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