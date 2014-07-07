var express = require('express');
var router = express.Router();
var relationships = require('../app/controllers/relationships');

var utils = require('../lib/utils');

// Parse 'from' and 'to' params
router.use(utils.parseUserParams('from'));
router.use(utils.parseUserParams('to'));

// POST /follow
router.post('/', relationships.create);

module.exports = router;