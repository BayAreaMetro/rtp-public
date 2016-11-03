'use strict';

describe('Controller: ExploreDetailCtrl', function () {

  // load the controller's module
  beforeEach(module('rtpApp'));

  var ExploreDetailCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ExploreDetailCtrl = $controller('ExploreDetailCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
