'use strict';

describe('Service: lookUp', function () {

  // load the service's module
  beforeEach(module('rtpApp'));

  // instantiate service
  var lookUp;
  beforeEach(inject(function (_lookUp_) {
    lookUp = _lookUp_;
  }));

  it('should do something', function () {
    expect(!!lookUp).toBe(true);
  });

});
