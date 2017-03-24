'use strict';

angular.module('rtpApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('data', {
                url: '/data',
                template: '<data></data>'
            })
            .state('data.map', {
                url: '/data.map',
                views: {
                    'data-content': {
                        templateUrl: 'app/data/templates/data.map.html',
                        controller: 'DataMapCtrl'
                    }
                }
            })
            .state('data.view', {
                url: '/data.view',
                views: {
                    'data-content': {
                        templateUrl: 'app/data/templates/data.view.html',
                        controller: 'DataViewCtrl'
                    }
                }
            });
    });