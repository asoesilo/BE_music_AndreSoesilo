var AppError = require('../errors/app_error');
var _ = require('underscore');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create schema for user object
var UserSchema = new Schema({
  _id: String,
  // list of users this user is following
  followees: [{
    type: String,
    ref: 'User'
  }],
  // list of music this user has listened to
  musicListened: [{
    type: String,
    ref: 'Music'
  }],
  // list of music genre this user has listened to and its count
  musicGenresListened: [{
    _id: {
      type: String,
      trim: true
    },
    count: {
      type: Number,
      min: 0
    }
  }]
});

UserSchema.methods = {
  // Add the specified user to the followees list
  addFollowee: function(user, callback) {
    if(!callback || !_.isFunction(callback)) {
      throw new AppError("invalid 'callback' variable provided");
    }

    if(!user || !_.isObject(user) || !user._id) {
      return callback(new AppError("invalid 'user' variable provided"));
    }

    if(this.followees.indexOf(user._id) !== -1) {
      // Already following the specified user, so do nothing
      return callback();
    }

    // Add user to followee list and save
    this.followees.push(user._id);
    this.save(callback);
  },

  // Add the specified music to the list of music listened
  addMusic: function(music, callback) {
    if(!callback || !_.isFunction(callback)) {
      throw new AppError("invalid 'callback' variable provided");
    }

    if(!music || !_.isObject(music) || !music._id || !music.genres) {
      return callback(new AppError("invalid 'music' variable provided"));
    }

    if(this.musicListened.indexOf(music._id) !== -1) {
      // Music already exist in the list of music listened, so do nothing
      return callback();
    }

    var self = this;
    var addedGenres = [];

    // Add music to list of listened music
    self.musicListened.push(music._id);

    // Update the list of music genres
    music.genres.forEach(function(name) {
      // Find genre from list of music genres listened to
      var genre = _.find(self.musicGenresListened, function(element) {
        return element._id === name;
      });

      if(genre) {
        // Genre found, so increment count
        genre.count++;
      }
      else {
        // Genre not found, so add it to list
        self.musicGenresListened.push({_id: name, count: 1});
      }
    });

    // Save changes to DB
    self.save(callback);
  }
}

mongoose.model('User', UserSchema);