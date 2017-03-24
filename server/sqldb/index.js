/**
 * Sequelize initialization module
 */

'use strict';

var path = require('path');
var config = require('../config/environment');
var Sequelize = require('sequelize');

var db = {
    Sequelize,
    sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Insert models below
db.LookUp = db.sequelize.import('../api/lookUp/lookUp.model');
db.Map = db.sequelize.import('../api/map/map.model');
db.Project = db.sequelize.import('../api/project/project.model');
db.Thing = db.sequelize.import('../api/thing/thing.model');

module.exports = db;