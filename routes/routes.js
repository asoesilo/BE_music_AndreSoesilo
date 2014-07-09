var express = require('express');
var router = express.Router();

// Require routes
var follow = require('./follow');
var listen = require('./listen');

// Configure routes
router.use('/follow', follow);
router.use('/listen', listen);

module.exports = router;