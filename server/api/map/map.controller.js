/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/maps              ->  index
 * POST    /api/maps              ->  create
 * GET     /api/maps/:id          ->  show
 * PUT     /api/maps/:id          ->  update
 * DELETE  /api/maps/:id          ->  destroy
 * findOne  /api/maps/findOne/:id          ->  Find a specific mapped project based on rtpId
 * findAll  /api/maps/findAll              ->  Find all mapped projects
 */

'use strict';

import _ from 'lodash';
import { Map } from '../../sqldb';
var config = require('./../../config/environment');
import sql from 'mssql';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if (entity) {
            res.status(statusCode).json(entity);
        }
    };
}

function saveUpdates(updates) {
    return function(entity) {
        return entity.updateAttributes(updates)
            .then(updated => {
                return updated;
            });
    };
}

function removeEntity(res) {
    return function(entity) {
        if (entity) {
            return entity.destroy()
                .then(() => {
                    res.status(204).end();
                });
        }
    };
}

function handleEntityNotFound(res) {
    return function(entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        res.status(statusCode).send(err);
    };
}

// Gets a list of Maps
export function index(req, res) {
    return Map.findAll()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Map from the DB
export function show(req, res) {
    return Map.find({
            where: {
                _id: req.params.id
            }
        })
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Map in the DB
export function create(req, res) {
    return Map.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Updates an existing Map in the DB
export function update(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    return Map.find({
            where: {
                _id: req.params.id
            }
        })
        .then(handleEntityNotFound(res))
        .then(saveUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Map from the DB
export function destroy(req, res) {
    return Map.find({
            where: {
                _id: req.params.id
            }
        })
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

export function findAll(req, res) {
    console.log(req.params.id);
    var request = new sql.Request(config.mssql.connection);
    var query = "Select * From [RTP].[dbo].[map_VW] where wkt is not null";
    request.query(query, function(err, data) {
        if (err) {
            return handleError(res, err);
        }
        if (!data) {
            return res.status(404).send('Not Found');
        }
        console.log(data[0]);
        res.status(200).json(data);
    });
}

export function findAllProjects(req, res) {
    console.log(req.params.id);
    var request = new sql.Request(config.mssql.connection);
    var query = "Select * From [RTP].[dbo].[map_VW]";
    request.query(query, function(err, data) {
        if (err) {
            return handleError(res, err);
        }
        if (!data) {
            return res.status(404).send('Not Found');
        }
        console.log(data[0]);
        res.status(200).json(data);
    });
}

export function findOne(req, res) {
    console.log(req.params.id);
    var request = new sql.Request(config.mssql.connection);
    var rtpId = req.params.id;
    var query = "Select * From [RTP].[dbo].[map_VW] where rtpId = '" + rtpId + "'";
    request.query(query, function(err, data) {
        if (err) {
            return handleError(res, err);
        }
        if (!data) {
            return res.status(404).send('Not Found');
        }
        console.log(data);
        res.status(200).json(data);
    });
}