'use strict';

angular.module('rtpApp')
    .service('projects', function($http) {
        var baseURL = "/api/projects";

        //Query all projects
        this.findAll = function() {
            return $http.get(baseURL + '/findAll', { cache: false });
        };

        //Find single project based on rtpId
        this.findOne = function(rtpId) {
            return $http.get(baseURL + '/findOne/' + rtpId);
        };

    });