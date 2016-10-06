'use strict';

angular.module('rtpApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('data', {
        url: '/data',
        template: '<data></data>'
      });
  });
