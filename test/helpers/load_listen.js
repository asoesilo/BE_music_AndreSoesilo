var app = require('../../app');
var async = require('async');
var request = require('supertest');
var data = require('../../json/listen').userIds;

var loadMusics = function(userID, musicList, index, next) {
  if(index >= musicList.length) {
    return next();
  }

  var musicID = musicList[index];

  request(app)
    .post('/listen')
    .send({user: userID, music: musicList[index]})
    .end(function(err) {
      if(err) {
        return next(err);
      }

      loadMusics(userID, musicList, index + 1, next);
    });  
}

var load = function(next) {
  async.each(Object.keys(data), function(userID, done) {
    var musicList = data[userID];
    loadMusics(userID, musicList, 0, done);
  }, function(err) {
    next(err);
  });
};

module.exports.load = load;