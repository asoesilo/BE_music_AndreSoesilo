var express = require('express');
var router = express.Router();
var musicLists = require('../app/controllers/music_lists');

var utils = require('../lib/utils');

// Parse 'user' and 'music' params
router.use(utils.parseUserParams('user'));
router.use(utils.parseMusicParams('music'));

// POST /listen
router.post('/', musicLists.add);

module.exports = router;