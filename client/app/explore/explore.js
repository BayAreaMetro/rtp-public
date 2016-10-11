'use strict';

angular.module('rtpApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('explore', {
        url: '/explore',
        template: '<explore></explore>'
      });
  });
