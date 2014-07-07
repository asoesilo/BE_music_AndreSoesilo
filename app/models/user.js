var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create schema for user object
var UserSchema = new Schema({
  _id: String,
  followees: [{
    type: String,
    ref: 'User'
  }],
  musicListened: [{
    type: String,
    ref: 'Music'
  }],
  musicCategoriesListened: [{
    categoryName: {
      type: String,
      trim: true
    },
    count: {
      type: Number,
      min: 0
    }
  }]
});

mongoose.model('User', UserSchema);