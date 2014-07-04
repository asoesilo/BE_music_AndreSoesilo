var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/config');

// Connect to Mongo DB
mongoose.connect(config.db);

// Initialize Express App
var app = express();

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers

// Development error handler
// Will print stacktrace
if (app.get('env') === 'development') {
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

var port = process.env.PORT || config.port || 3000;
app.listen(port);

console.log('BE Music API server started');

module.exports = app;
