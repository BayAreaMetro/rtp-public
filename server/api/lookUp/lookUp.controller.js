/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/lookUps                     ->  index
 * GET     /api/lookUps /modes             ->  modes
 * GET     /api/lookUps/counties           ->  counties
 * GET     /api/lookUps/sponsors           ->  sponsors
 * GET    /api/lookUps/rtpIds              ->  rtpIds
 * GET     /api/lookUps/:id          ->  show
 * PUT     /api/lookUps/:id          ->  update
 * DELETE  /api/lookUps/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import { LookUp } from '../../sqldb';
import sql from 'mssql';
var config = require('./../../config/environment');

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

// Gets a list of LookUps
export function index(req, res) {
    return LookUp.findAll()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single LookUp from the DB
export function show(req, res) {
    return LookUp.find({
            where: {
                _id: req.params.id
            }
        })
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new LookUp in the DB
export function create(req, res) {
    return LookUp.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Updates an existing LookUp in the DB
export function update(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    return LookUp.find({
            where: {
                _id: req.params.id
            }
        })
        .then(handleEntityNotFound(res))
        .then(saveUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a LookUp from the DB
export function destroy(req, res) {
    return LookUp.find({
            where: {
                _id: req.params.id
            }
        })
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

export function rtpIds(req, res) {
    var ids = [];
    var request = new sql.Request(config.mssql.connection);
    var query = "Select rtpId From [RTP].[dbo].[project]";
    request.query(query, function(err, data) {
        if (err) {
            return handleError(res, err);
        }
        if (!data) {
            return res.status(404).send('Not Found');
        }
        data.forEach(function(element) {
            ids.push(element.rtpId);
        }, this);
        res.status(200).json(ids);
    });
}

export function sponsors(req, res) {
    var request = new sql.Request(config.mssql.connection);
    var query = "Select agency From [RTP].[dbo].[agency_LU] order by agency";
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

export function modes(req, res) {
    var request = new sql.Request(config.mssql.connection);
    var query = "Select mode From [RTP].[dbo].[mode_LU]";
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

export function counties(req, res) {
    var request = new sql.Request(config.mssql.connection);
    var query = "Select county From [RTP].[dbo].[county_LU]";
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