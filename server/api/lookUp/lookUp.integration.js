'use strict';

var app = require('../..');
import request from 'supertest';

var newLookUp;

describe('LookUp API:', function() {

  describe('GET /api/lookUps', function() {
    var lookUps;

    beforeEach(function(done) {
      request(app)
        .get('/api/lookUps')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          lookUps = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      lookUps.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/lookUps', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/lookUps')
        .send({
          name: 'New LookUp',
          info: 'This is the brand new lookUp!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newLookUp = res.body;
          done();
        });
    });

    it('should respond with the newly created lookUp', function() {
      newLookUp.name.should.equal('New LookUp');
      newLookUp.info.should.equal('This is the brand new lookUp!!!');
    });

  });

  describe('GET /api/lookUps/:id', function() {
    var lookUp;

    beforeEach(function(done) {
      request(app)
        .get('/api/lookUps/' + newLookUp._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          lookUp = res.body;
          done();
        });
    });

    afterEach(function() {
      lookUp = {};
    });

    it('should respond with the requested lookUp', function() {
      lookUp.name.should.equal('New LookUp');
      lookUp.info.should.equal('This is the brand new lookUp!!!');
    });

  });

  describe('PUT /api/lookUps/:id', function() {
    var updatedLookUp;

    beforeEach(function(done) {
      request(app)
        .put('/api/lookUps/' + newLookUp._id)
        .send({
          name: 'Updated LookUp',
          info: 'This is the updated lookUp!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedLookUp = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedLookUp = {};
    });

    it('should respond with the updated lookUp', function() {
      updatedLookUp.name.should.equal('Updated LookUp');
      updatedLookUp.info.should.equal('This is the updated lookUp!!!');
    });

  });

  describe('DELETE /api/lookUps/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/lookUps/' + newLookUp._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when lookUp does not exist', function(done) {
      request(app)
        .delete('/api/lookUps/' + newLookUp._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
