var AppError = require('../errors/app_error');
var Engine = require('../../lib/music_recommendation_engine');

var get = function(req, res, next) {
  var user = req.user;

  if(!user) {
    // Missing parameters
    // Forward error message
    var err = new AppError('Missing parameter: "user" parameters must be provided and be valid');
    err.status = 400;
    return next(err);
  }

  Engine.getMusicRecommendations(user, function(err, list) {
    if(err) {
      // Error in getting list of songs to recommend
      // Forward error message
      err.status = 400;
      return next(err);
    }

    // Retrieved list of songs to recommend successfully
    // Return list to client along with HTTP OK message
    res.json(200, {list: list});
  });
};

module.exports.get = get;