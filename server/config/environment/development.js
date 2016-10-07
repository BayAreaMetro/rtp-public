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

var connection = new mssql.Connection(config, function(err) {
    if (err) {

        console.log(err);
        console.log('is the error');
    }

});

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
        connection: connection
    },

    // Seed database on startup
    seedDB: false

};