var express = require('express');
var router = express.Router();
var recommendations = require('../app/controllers/music_recommendations');

var utils = require('../lib/utils');

// Parse 'from' and 'to' params
router.use(utils.parseUserParams('user'));

// GET /recommendations
router.get('/', recommendations.get);

module.exports = router;