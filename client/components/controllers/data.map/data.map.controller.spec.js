'use strict';

describe('Controller: DataMapCtrl', function () {

  // load the controller's module
  beforeEach(module('rtpApp'));

  var DataMapCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DataMapCtrl = $controller('DataMapCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
