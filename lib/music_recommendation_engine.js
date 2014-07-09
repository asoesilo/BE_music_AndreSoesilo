var _ = require('underscore');
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Music = mongoose.model('Music');

var NUM_MUSICS_TO_RECOMMEND = 5;

// Returns list of 5 musics to be recommended to this user
var getMusicRecommendations = function(user, callback) {
  if(!callback || !_.isFunction(callback)) {
    throw new AppError("invalid 'callback' variable provided");
  }

  if(!user || !_.isObject(user)) {
    return callback(new AppError("invalid 'user' variable provided"));
  }

  // Get list of music that followees (and possibly followees' followees) have listened to
  getFolloweesMusic(user, [], user.followees, [], function(err, musicIDList) {
    if(err) {
      return callback(err);
    }

    // Get the list of genre name that this user has listened to
    var genresListened = _.map(user.musicGenresListened, function(genre) {
      return genre.genreName;
    });

    // Get more songs based on the genres that this user has listened to,
    // if followees' music list is less than five
    populateMusicListIfNotEnough(musicIDList, genresListened, function(err, newMusicIDList) {
      if(err) {
        return callback(err);
      }

      musicIDList = newMusicIDList;

      // Get more music (randomly), if followees' music list is still less than five
      populateMusicListIfNotEnough(musicIDList, [], function(err, newMusicIDList) {
        // Sort music list based on the music genres that user have listened to
        sortMusicList(user, newMusicIDList, function(err, sortedMusicIDList) {
          if(err) {
            return callback(err);
          }
          // Get top five sorted music ID
          sortedMusicIDList = _.first(sortedMusicIDList, 5);

          callback(null, sortedMusicIDList);
        });
      });
    });
  });
};

// Returns the total point for the specified music ID
// NOTE: The point is based on the genres that the specified user has listened to
var getMusicPoints = function(user, musicID, next) {
  var genresListened;
  var points;

  // Get the music information from database
  Music.findOne({_id: musicID}, function(err, music) {
    if(err) {
      return next(err);
    }

    // Retrieve a list of genres that the user has listened to and are in the genre of this music
    genresListened = _.filter(user.musicGenresListened, function(genre) {
      return music.genres.indexOf(genre._id) >= 0;
    });

    // Sum the counts of the filtered genres
    points = _.reduce(genresListened, function(sum, item) { return sum + item.count }, 0);

    return next(null, points);
  });
};

// Returns the next set of followees for the specified users
//
// visitedFollowees: List of previously specified followees
var getNextFollowees = function(users, visitedFollowees, next) {
  var followeeList = [];

  // Iterate through all current users to get their followees
  users.forEach(function(currentUser) {
    // Iterate through all followees of current user
    currentUser.followees.forEach(function(followee) {
      if(followeeList.indexOf(followee) < 0 && visitedFollowees.indexOf(followee) < 0) {
        // Followee has never been visited so add to list
        followeeList.push(followee);
        visitedFollowees.push(followee);
      }
    });
  });
  next(followeeList, visitedFollowees);
}

// Returns the music list listened by the specified followees, but not by the specified user
var getUsersMusic = function(user, followees, musicIDList, next) {
  followees.forEach(function(currentUser) {
    // Iterate through all music listened by current user
    currentUser.musicListened.forEach(function(musicID) {
      if(musicIDList.indexOf(musicID) < 0 && user.musicListened.indexOf(musicID) < 0) {
        // Music is not yet in the current music list, so add to the list
        musicIDList.push(musicID);
      }
    });
  });

  next(musicIDList);
}

// Visits the specified followees and returns the music listened by
// their followees (and maybe followees' followees)
//
// musicIDList: current list of music that are tracked
// currentFolloweeslist: list of followees to be visited
// visitedFollowees: list of followees that have been visited
var getFolloweesMusic = function(user, musicIDList, currentFolloweeslist, visitedFollowees, next) {
  var followeeList;

  // Get all users in the current followees list
  User.where('_id').in(currentFolloweeslist).exec(function(err, users) {
    if(err) {
      return next(err);
    }

    var asyncTasks = [];

    asyncTasks.push(function(done) {
      // Task 1
      // Gets the next set of followees list to be visited
      getNextFollowees(users, visitedFollowees, function(newFolloweeList, newVisitedFollowees) {
        followeeList = newFolloweeList;
        visitedFollowees = newVisitedFollowees;
        done();
      });
    });

    asyncTasks.push(function(done) {
      // Task 2
      // Gets the list of music listened by the current followees
      getUsersMusic(user, users, musicIDList, function(newMusicIDList) {
        musicIDList = newMusicIDList;
        done();
      });
    });

    // Executes all tasks in parallel
    async.parallel(asyncTasks, function() {
      if(musicIDList.length < NUM_MUSICS_TO_RECOMMEND && followeeList.length > 0){
        // Not enough music in list, and there are more followees that can be visited
        // So get more music from the next set of followees
        getFolloweesMusic(user, musicIDList, followeeList, visitedFollowees, next);
      }

      return next(null, musicIDList);
    });
  });
};

// Populates the music list with more songs, if it is less than
// the expected number of songs to be recommended
//
// musicIDList: current list of music ID
var populateMusicListIfNotEnough = function(musicIDList, genres, next) {
  if(musicIDList.length >= NUM_MUSICS_TO_RECOMMEND) {
    // There are already enough number of music IDs accumulated in the list,
    // so return the list as is
    return next(null, musicIDList);
  }

  // Gets list of music IDs that are not in the current list of music ID
  var query = Music.where('_id').nin(musicIDList);

  if(genres > 0) {
    // Gets list of music that are only in the specified genres
    query = query.where('genres').in(genres);
  }

  query
  // Gets only enough number of songs so that the music list have
  // the expected number of songs to be recommended
  .limit(NUM_MUSICS_TO_RECOMMEND - musicIDList.length)
  .select('_id')
  .exec(function(err, otherMusicList) {
    if(err) {
      return next(err);
    }

    // Map the resulting music objects to an array of music ID
    var otherMusicIDList = _.map(otherMusicList, function(music) {
      return music._id;
    });

    // Adds the returned list into the current list of music ID
    musicIDList.push.apply(musicIDList, otherMusicIDList);

    return next(null, musicIDList);
  });
};

// Maps the specified list of music IDs with its corresponding points
// based on the music genres listened by the specified user
var mapMusicPoints = function(user, musicIDList, next) {
  var musicPointList = [];

  // Gets the points for each music
  async.each(musicIDList, function(musicID, done) {
    // Gets the point for current music
    getMusicPoints(user, musicID, function(err, point) {
      if(err) {
        return done(err);
      }

      // Store the music ID and its point
      musicPointList.push({id: musicID, point: point});
      done();
    });
  }, function(err) {
    return next(err, musicPointList);
  });
}

// Sorts the specified list of music ID based on the relevance to the users
var sortMusicList = function(user, musicIDList, next) {
  var sortedMusicList;

  // Gets the points for each music
  mapMusicPoints(user, musicIDList, function(err, musicPointsList) {
    if(err) {
      return next(err);
    }

    sortedMusicList = musicPointsList;

    // Sorts the music list by its points
    // Music with the highest points come first
    sortedMusicList = _.sortBy(sortedMusicList, function(music) {
      return -music.point;
    });

    // Gets only the music IDs
    sortedMusicList = _.map(sortedMusicList, function(music) {
      return music.id;
    });

    next(null, sortedMusicList);
  });
};

module.exports.getMusicRecommendations = getMusicRecommendations;
