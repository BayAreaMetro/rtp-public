'use strict';

describe('Component: SearchComponent', function () {

  // load the controller's module
  beforeEach(module('rtpApp'));

  var SearchComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    SearchComponent = $componentController('SearchComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
