var express = require('express');
var app = express();

// Get runtime environment
var env = process.env.NODE_ENV || 'development';

// Set up configuration
var config = {};
switch(env) {
  case 'test':
    config.db = 'mongodb://localhost/data_test';
    break;
  default:
    config.db = 'mongodb://localhost/data';
}
config.port = process.env.PORT || 3000;
config.env = env;

module.exports = config;