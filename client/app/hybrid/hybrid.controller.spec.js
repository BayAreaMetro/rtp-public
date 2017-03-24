'use strict';

describe('Component: HybridComponent', function () {

  // load the controller's module
  beforeEach(module('rtpApp'));

  var HybridComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    HybridComponent = $componentController('HybridComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
