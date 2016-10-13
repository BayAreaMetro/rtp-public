'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var lookUpCtrlStub = {
  index: 'lookUpCtrl.index',
  show: 'lookUpCtrl.show',
  create: 'lookUpCtrl.create',
  update: 'lookUpCtrl.update',
  destroy: 'lookUpCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var lookUpIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './lookUp.controller': lookUpCtrlStub
});

describe('LookUp API Router:', function() {

  it('should return an express router instance', function() {
    lookUpIndex.should.equal(routerStub);
  });

  describe('GET /api/lookUps', function() {

    it('should route to lookUp.controller.index', function() {
      routerStub.get
        .withArgs('/', 'lookUpCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/lookUps/:id', function() {

    it('should route to lookUp.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'lookUpCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/lookUps', function() {

    it('should route to lookUp.controller.create', function() {
      routerStub.post
        .withArgs('/', 'lookUpCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/lookUps/:id', function() {

    it('should route to lookUp.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'lookUpCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/lookUps/:id', function() {

    it('should route to lookUp.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'lookUpCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/lookUps/:id', function() {

    it('should route to lookUp.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'lookUpCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
