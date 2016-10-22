'use strict';

angular.module('rtpApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('hybrid', {
        url: '/hybrid',
        template: '<hybrid></hybrid>'
      });
  });
