var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/config');
var fs = require('fs');

// Connect to Mongo DB
mongoose.connect(config.db);

// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  if (file.indexOf('.js') !== -1) {
    require(models_path + '/' + file);
  }
});

// Require routes
var routes = require('./routes/routes');

var populator = require('./lib/populator');

// Initialize Express App
var app = express();

// Parse json data to request body
app.use(bodyParser.json());

// Configure routes
app.use(routes);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers

// Development error handler
// Will print stacktrace
if (config.env === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({'error': err.message, 'stack': err});
  });
}

// Production error handler
// No stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'error': err.message});
});

// Populate DB
populator.populateDB(function(err) {
  if(err) {
    // Error in populating DB
    console.log('Error in populating DB');
    throw new Error(err);
  }
  // Start listening to port
  app.listen(config.port);
  console.log('BE Music API server started');
});

module.exports = app;
