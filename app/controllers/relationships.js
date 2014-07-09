var AppError = require('../errors/app_error');
var mongoose = require('mongoose');
var User = mongoose.model('User');

// Create new relationship
// Add followee to specified user's followee list
var create = function(req, res, next) {
  var from = req.from;
  var to = req.to;

  if(!from || !to) {
    // Missing parameters
    // Forward error message
    var err = new AppError('Invalid paramaters: both "from" and "to" paramaters must be provided and be valid');
    err.status = 400;
    return next(err);
  }

  from.addFollowee(to, function(err) {
    if(err) {
      // Error in adding followee to user list
      // Forward error message
      err.status = 400;
      return next(err);
    }

    // Followee added to user list successfully
    // Send OK message
    res.send(200);
  });
};

module.exports.create = create;