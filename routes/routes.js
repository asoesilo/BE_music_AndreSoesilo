var express = require('express');
var router = express.Router();

// Require routes
var follow = require('./follow');
var listen = require('./listen');
var recommendations = require('./recommendations');

// Configure routes
router.use('/follow', follow);
router.use('/listen', listen);
router.use('/recommendations', recommendations);

module.exports = router;