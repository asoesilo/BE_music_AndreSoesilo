var mongoose = require('mongoose');
var User = mongoose.model('User');
var Music = mongoose.model('Music');

// Return middleware to find the specified entry from DB,
// and assign it directly to request param
// paramName: name of param in the request param, which contains the ID of the module to be searched for
// model:     model where the ID is to be searched for
var parseParams = function(paramName, model) {
  return function(req, res, next) {
    var param = req.body[paramName];

    if(!param) {
      // Param is not found
      return next();
    }

    // Search entry from the specified model
    model.findOne({_id: param}, function(err, user) {
      if(err) {
        // Error while finding entry
        return next(err);
      }
      // Set entry to request param
      req[paramName] = user;
      return next();
    });
  };
};

// Return middleware to find the specified User from DB
// and assign it directly to request param
var parseUserParams = function(paramName) {
  return parseParams(paramName, User);
};

// Return middleware to find the specified Music from DB
// and assign it directly to request param
var parseMusicParams = function(paramName) {
  return parseParams(paramName, Music);
};

module.exports.parseUserParams = parseUserParams;
module.exports.parseMusicParams = parseMusicParams;