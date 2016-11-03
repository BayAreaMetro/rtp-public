'use strict';

angular.module('rtpApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('explore', {
                url: '/explore',
                template: '<explore></explore>'
            })
            .state('explore.map', {
                url: '/explore.map',
                views: {
                    'explore-content': {
                        templateUrl: 'app/explore/templates/explore.map.html',
                        controller: 'ExploreMapCtrl'
                    }
                }
            })
            .state('explore.data', {
                url: '/explore.data',
                views: {
                    'explore-content': {
                        templateUrl: 'app/explore/templates/explore.data.html',
                        controller: 'ExploreDataCtrl'
                    }
                }
            })
            .state('explore.detail', {
                url: '/explore.detail',
                views: {
                    'explore-content': {
                        templateUrl: 'app/explore/templates/explore.detail.html',
                        controller: 'ExploreDetailCtrl'
                    }
                }
            });
    });