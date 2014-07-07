var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create schema for music object
var MusicSchema = new Schema({
  _id: String,
  genres: [{
    type: String,
    trim: true
  }]
});

// Setup validations
MusicSchema.path('genres').required(true, 'Music genres cannot be blank');

// Set up schema model for musics
mongoose.model('Music', MusicSchema);