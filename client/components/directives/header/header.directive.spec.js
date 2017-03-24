'use strict';

describe('Directive: header', function () {

  // load the directive's module and view
  beforeEach(module('rtpApp'));
  beforeEach(module('components/directives/header/header.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<header></header>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the header directive');
  }));
});
