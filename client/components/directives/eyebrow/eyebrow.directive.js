'use strict';

angular.module('rtpApp')
  .directive('eyebrow', function () {
    return {
      templateUrl: 'components/directives/eyebrow/eyebrow.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
