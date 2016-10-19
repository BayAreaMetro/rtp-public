'use strict';

describe('Directive: eyebrow', function () {

  // load the directive's module and view
  beforeEach(module('rtpApp'));
  beforeEach(module('components/directives/eyebrow/eyebrow.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<eyebrow></eyebrow>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the eyebrow directive');
  }));
});
