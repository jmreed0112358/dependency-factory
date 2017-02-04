'use strict';

const DependencyFactory = require('../src/dependency-factory'),
  chai = require('chai'),
  expect = chai.expect;


describe('DependencyFactory', function() {
  describe('registerDependency()', function() {
    it('should register dependencies correctly', function(done) {
      var factory = new DependencyFactory();

      factory.registerDependency('foo', 'foo');

      expect(factory.isDependencyRegistered('foo')).to.equal(true);
      done();
    });

    it('should throw Error when given non-string input for depName', function(done) {
      var factory = new DependencyFactory();

      expect(function () {
        factory.registerDependency(42, 'foo');
      }).to.throw('Invalid types for depName and/or depPath');
      done();
    });

    it('should throw Error when given non-string input for depName', function(done) {
      var factory = new DependencyFactory();

      expect(function () {
        factory.registerDependency('foo', 42);
      }).to.throw('Invalid types for depName and/or depPath');
      done();
    });
  });

  describe('getDependency()', function() {
    it('should get a local dependency correctly', function(done) {
      var factory = new DependencyFactory(),
        Factory = null,
        test = null;

      factory.registerDependency('DependencyFactory', '../src/dependency-factory');

      expect(factory.isDependencyRegistered('DependencyFactory')).to.equal(true);

      Factory = factory.getDependency('DependencyFactory');
      test = new Factory();

      expect(test instanceof Factory).to.equal(true);
      done();
    });

    it('should get a npm installed dependency correctly', function(done) {
      var factory = new DependencyFactory(),
        validator = null;

      factory.registerDependency('validator', 'validator');

      expect(factory.isDependencyRegistered('validator')).to.equal(true);

      validator = factory.getDependency('validator');

      expect(validator.isEmail('foo@bar.com')).to.equal(true);
      done();
    });
  });
}); 