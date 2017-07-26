/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/projects              ->  index
 * POST    /api/projects              ->  create
 * GET     /api/projects/:id          ->  show
 * PUT     /api/projects/:id          ->  update
 * DELETE  /api/projects/:id          ->  destroy
 * findOne  /api/projects/findOne/:id          ->  Find a specific project based on rtpId
 * findAll  /api/projects/findAll              ->  Find all projects
 */

'use strict';

import _ from 'lodash';
import sql from 'mssql';
import {
    Project
} from '../../sqldb';
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

// Gets a list of Projects
export function index(req, res) {
    return Project.findAll()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Project from the DB
export function show(req, res) {
    return Project.find({
            where: {
                _id: req.params.id
            }
        })
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Project in the DB
export function create(req, res) {
    return Project.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Updates an existing Project in the DB
export function update(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    return Project.find({
            where: {
                _id: req.params.id
            }
        })
        .then(handleEntityNotFound(res))
        .then(saveUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Project from the DB
export function destroy(req, res) {
    return Project.find({
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
    var query = "Select * From [RTP].[dbo].[project_VW]";
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
    var query = "Select * From [RTP].[dbo].[project_VW] where rtpId = '" + rtpId + "'";
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

export function findOneFMS(req, res) {
    console.log(req.params.id);
    console.log(req.params.cycle);
    var request, query;
    var rtpId = req.params.id;
    var cycle = req.params.cycle;
    if (cycle === '2035') {
        request = new sql.Request(config.mssql.connection_2035);
        query = "Select * From [dbo].[FMS_View] WHERE RTPID = '" + rtpId + "'";
    } else if (cycle === '2040') {
        request = new sql.Request(config.mssql.connection_2040);
        query = "Select * From [dbo].[projects_master] WHERE RTPID = '" + rtpId + "'";
    }

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

export function search(req, res) {
    var params = req.body;
    console.log('the body is');
    console.log(params);
    console.log(params.length);
    //Array of key pair values
    // params = _.toPairs(params);

    var queryParams = '';
    var query = 'Select * From [RTP].[dbo].[project_VW]';

    //Build query string based on number of parameters
    if (params.length === 0) {
        query = query;
    } else if (params.length === 1) {
        var paramName = _.keys(params[0]);
        switch (paramName[0]) {
            case 'title':
                console.log('in the title');
                query = "Select * From [RTP].[dbo].[project_VW] Where ";
                queryParams = "title like '%" + _.values(params[0]) + "%' OR description like '%" + _.values(params[0]) + "%'";
                query += queryParams;
                break;

            default:
                console.log(params[0]);
                console.log(_.values(params[0]))
                console.log(_.keys(params[0]));
                query = 'Select * From [RTP].[dbo].[project_VW] Where ';
                queryParams = _.keys(params[0]) + " = '" + _.values(params[0]) + "'";
                query += queryParams;
                break;
        }

    } else if (params.length > 1) {
        query = 'Select * From [RTP].[dbo].[project_VW] Where ';
        for (var i = 0; i < params.length; i++) {
            if (_.keys(params[i])[0] === 'title') {
                queryParams += "title like '%" + _.values(params[i]) + "%' OR description like '%" + _.values(params[i]) + "%' AND ";
            } else {
                queryParams += _.keys(params[i]) + " = '" + _.values(params[i]) + "' AND ";
            }
        }
        //Remove final AND from string;
        queryParams = queryParams.substring(0, queryParams.length - 5);
        query += queryParams;

    }
    console.log(query);
    var request = new sql.Request(config.mssql.connection);
    request.query(query, function(err, data) {
        if (err) {
            return handleError(res, err);
        }
        if (!data) {
            return res.status(404).send('Not Found');
        }
        res.status(200).json(data);
    });
}