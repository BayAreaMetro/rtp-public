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

// Production specific configuration
// =================================
module.exports = {
    // Server IP
    ip: process.env.OPENSHIFT_NODEJS_IP ||
        process.env.IP ||
        undefined,

    // Server port
    port: process.env.OPENSHIFT_NODEJS_PORT ||
        process.env.PORT ||
        8080,
    //MSSQL Connection Options
    mssql: {
        config: config,
        connection: connection
    },

    sequelize: {
        uri: process.env.SEQUELIZE_URI ||
            'sqlite://',
        options: {
            logging: false,
            storage: 'dist.sqlite',
            define: {
                timestamps: false
            }
        }
    }
};