'use strict';

describe('Controller: ExploreMapCtrl', function () {

  // load the controller's module
  beforeEach(module('rtpApp'));

  var ExploreMapCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ExploreMapCtrl = $controller('ExploreMapCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
