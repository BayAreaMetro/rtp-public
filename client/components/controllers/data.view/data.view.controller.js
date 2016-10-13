'use strict';

angular.module('rtpApp')
  .controller('DataViewCtrl', function ($scope, projects, $rootScope, $location) {

    /**
     * Load current project
     */

    var rtpId;

    //Check for rtpId in the url Parameter or in rootScope
    if ($location.search().rtpId) {
      rtpId = $location.search().rtpId;
    } else if ($rootScope.rtpId) {
      rtpId = $rootScope.rtpId;
    };

    //Set url paramter to current rtpId
    $location.search('rtpId', rtpId);
    projects.findOne(rtpId).then(response => {
      $scope.projectDetail = response.data[0];
      console.log($scope.projectDetail.title);
    })
  });