var async = require('async');
var mongoose = require('mongoose');
var Music = mongoose.model('Music');
var musicList = require('../json/music');

// Populate DB with entries in music.json
var populateDB = function(next) {
  async.each(Object.keys(musicList), function(id, done) {
    // Check for song with the same ID
    Music.findOne({_id: id}, function(err, music) {
      if(err) {
        // Error in finding song
        return done(err);
      }

      if(!music) {
        // No song with the same ID is found
        // Save song to DB
        var genres = musicList[id];
        var newMusic = new Music({_id: id, genres: genres});
        newMusic.save(done);
      }
      else {
        done();
      }
    });
  }, function(err) {
    // Done with populating database
    // Call next callback with error, if exists
    next(err);
  });
};

module.exports.populateDB = populateDB;