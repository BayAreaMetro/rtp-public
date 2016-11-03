'use strict';

angular.module('rtpApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('search', {
        url: '/search',
        template: '<search></search>'
      });
  });
