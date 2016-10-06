/**
 * Sequelize initialization module
 */

'use strict';

import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Insert models below
db.Map = db.sequelize.import('../api/map/map.model');
db.Project = db.sequelize.import('../api/project/project.model');
db.Thing = db.sequelize.import('../api/thing/thing.model');

module.exports = db;
