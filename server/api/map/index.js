'use strict';

var express = require('express');
var controller = require('./map.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/findAll', controller.findAll);
router.get('/findOne/:id', controller.findOne);
router.get('/findAllProjects', controller.findAllProjects);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;