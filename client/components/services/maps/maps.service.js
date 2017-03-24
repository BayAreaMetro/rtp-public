'use strict';

angular.module('rtpApp')
    .service('maps', function($http) {
        var baseURL = "/api/maps/";

        //Query all mapped projects
        this.findAll = function() {
            return $http.get(baseURL, { cache: false });
        };

        //Find single mapped project based on rtpId
        this.findOne = function(rtpId) {
            return $http.get(baseURL + 'findOne/' + rtpId);
        };

    });