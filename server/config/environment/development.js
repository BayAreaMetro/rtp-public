'use strict';
var mssql = require('mssql');

//MsSQL configuration and connection information
var config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PWD,
    server: process.env.SERVER, // You can use 'localhost\\instance' to connect to named instance
    database: process.env.DATABASE,
    connectionTimeout: 30000,
    requestTimeout: 30000,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }

};

var config_2040 = {
    user: process.env.GISDB1_USER,
    password: process.env.GISDB1_PWD,
    server: process.env.GISDB1_SERVER, // You can use 'localhost\\instance' to connect to named instance
    database: process.env.GISDB1_DATABASE_2040,
    connectionTimeout: 30000,
    requestTimeout: 30000,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }

};

var config_2035 = {
    user: process.env.GISDB1_USER,
    password: process.env.GISDB1_PWD,
    server: process.env.GISDB1_SERVER, // You can use 'localhost\\instance' to connect to named instance
    database: process.env.GISDB1_DATABASE_2035,
    connectionTimeout: 30000,
    requestTimeout: 30000,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }

};

var connection = new mssql.Connection(config, function(err) {
    if (err) {

        console.log(err);
        console.log('is the error');
    }

});

var connection_2040 = new mssql.Connection(config_2040, function(err) {
    if (err) {

        console.log(err);
        console.log('is the error');
    }

});

var connection_2035 = new mssql.Connection(config_2035, function(err) {
    if (err) {

        console.log(err);
        console.log('is the error');
    }

});
// connection.connect(function(err) {
//     console.log(err);
// });

// Development specific configuration
// ==================================
module.exports = {

    // Sequelize connection opions
    sequelize: {
        uri: 'sqlite://',
        options: {
            logging: false,
            storage: 'dev.sqlite',
            define: {
                timestamps: false
            }
        }
    },
    //MSSQL Connection Options
    mssql: {
        config: config,
        connection: connection,
        config_2040: config_2040,
        connection_2040: connection_2040,
        config_2035: config_2035,
        connection_2035: connection_2035
    },

    // Seed database on startup
    seedDB: false

};