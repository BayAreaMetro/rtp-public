'use strict';

angular.module('rtpApp')
    .service('lookUp', function($http) {
        var baseURL = "/api/lookUps/";

        //Query all rtpIds
        this.rtpIds = function() {
            return $http.get(baseURL + 'rtpIds');
        };

        //Query all rtpIds
        this.counties = function() {
            return $http.get(baseURL + 'counties');
        };

        //Query all rtpIds
        this.modes = function() {
            return $http.get(baseURL + 'modes');
        };

        //Query all rtpIds
        this.sponsors = function() {
            return $http.get(baseURL + 'sponsors');
        };

    });