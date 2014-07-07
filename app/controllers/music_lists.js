var AppError = require('../errors/app_error');
var mongoose = require('mongoose');
var User = mongoose.model('User');

// Returns middleware to add music into list of music that user has listened to
var add = function(req, res, next) {
  var user = req.user;
  var music = req.music;

  if(!user || !music) {
    // Missing parameters
    // Forward error message
    var err = new AppError('Missing parameters: both "user" and "music" parameters must be provided and be valid');
    err.status = 400;
    return next(err);
  }

  user.addMusic(music, function(err) {
    if(err) {
      // Error in adding music to user list
      // Forward error message
      return next(err);
    }

    // Added music to user list successfully
    // Send OK message
    res.send(200);
  });
};

module.exports.add = add;