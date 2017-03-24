'use strict';

describe('Controller: DataViewCtrl', function () {

  // load the controller's module
  beforeEach(module('rtpApp'));

  var DataViewCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DataViewCtrl = $controller('DataViewCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
