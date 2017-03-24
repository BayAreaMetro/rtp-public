'use strict';

angular.module('rtpApp')
  .directive('header', function () {
    return {
      templateUrl: 'components/directives/header/header.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
