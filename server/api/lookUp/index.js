'use strict';

var express = require('express');
var controller = require('./lookUp.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/modes', controller.modes);
router.get('/sponsors', controller.sponsors);
router.get('/rtpIds', controller.rtpIds);
router.get('/counties', controller.counties);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;