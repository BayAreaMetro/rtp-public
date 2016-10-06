'use strict';

angular.module('rtpApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('map', {
        url: '/map',
        template: '<map></map>'
      });
  });
