'use strict';

angular.module('rtpApp')
    .service('projects', function($http) {
        var baseURL = "/api/projects";
        var mapURL = '/api/maps';
        var currentProject = {};
        var mapProjectList = {};
        var searchList = [];
        var isMappable = true;

        //Query all projects
        this.findAll = function() {
            return $http.get(baseURL + '/findAll', {
                cache: false
            });
        };

        //Query projects based on search parameters
        this.search = function(searchParams) {
            return $http.post(baseURL + '/search', searchParams);
        };

        //Find single project based on rtpId
        this.findOne = function(rtpId) {
            return $http.get(baseURL + '/findOne/' + rtpId);
        };

        //Set current project
        this.setCurrentProject = function(project) {
            currentProject = project;
        }

        //Retrieve current project
        this.getCurrentProject = function() {
            return currentProject;
        }

        //Set projects to view on Map
        this.setViewOnMap = function(maps, onMap) {
            console.log(maps);
            isMappable = onMap;
            mapProjectList = maps;
        }

        //Retrieve project projects to view on map
        this.getViewOnMap = function() {
            return mapProjectList;
        }

        //Retrieve flag for whether projects are mappable or not
        this.getIsMappable = function() {
            return isMappable;
        }

        //Set project list based on search page parameters
        this.setSearchList = function(data) {
            searchList = data;
        }

        //Retrieve project list based on search page parameters
        this.getSearchList = function() {
            return searchList;
        }

    });