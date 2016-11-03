'use strict';

describe('Controller: ExploreDataCtrl', function () {

  // load the controller's module
  beforeEach(module('rtpApp'));

  var ExploreDataCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ExploreDataCtrl = $controller('ExploreDataCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
