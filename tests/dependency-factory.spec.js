'use strict';

const DependencyFactory = require('../src/dependency-factory'),
  Test = require('../src/test-module'),
  chai = require('chai'),
  expect = chai.expect;


describe('DependencyFactory', function() {
  describe('registerDependency()', function() {
    it('should register dependencies correctly', function(done) {
      var factory = new DependencyFactory();

      factory.registerDependency('foo', 'foo', 'object');

      expect(factory.isDependencyRegistered('foo')).to.equal(true);
      done();
    });

    it('should throw Error when given non-string input for depName', function(done) {
      var factory = new DependencyFactory();

      expect(function () {
        factory.registerDependency(42, 'foo');
      }).to.throw('Invalid types for depName, depPath, and/or depType');
      done();
    });

    it('should throw Error when given non-string input for depName', function(done) {
      var factory = new DependencyFactory();

      expect(function () {
        factory.registerDependency('foo', 42);
      }).to.throw('Invalid types for depName, depPath, and/or depType');
      done();
    });
  });

  describe('getDependency()', function() {
    it('should get a local constructor dependency correctly', function(done) {
      var factory = new DependencyFactory(),
        Factory = null,
        test = null;

      factory.registerDependency('DependencyFactory', '../src/dependency-factory', 'constructor');

      expect(factory.isDependencyRegistered('DependencyFactory')).to.equal(true);

      test = factory.getDependency('DependencyFactory');

      expect(test instanceof DependencyFactory).to.equal(true);
      done();
    });

    it('should get a npm installed object dependency correctly', function(done) {
      var factory = new DependencyFactory(),
        validator = null;

      factory.registerDependency('validator', 'validator', 'object');

      expect(factory.isDependencyRegistered('validator')).to.equal(true);

      validator = factory.getDependency('validator');

      expect(validator.isEmail('foo@bar.com')).to.equal(true);
      done();
    });

    it('should get a local constructor dependency with args correctly', function(done) {
      var factory = new DependencyFactory(),
        test = null;

      factory.registerDependency('Test', '../src/test-module', 'constructor');

      expect(factory.isDependencyRegistered('Test')).to.equal(true);

      test = factory.getDependency('Test', ['foo', 'bar']);

      expect(test instanceof Test).to.equal(true);
      expect(test.getArg1()).to.equal('foo');
      expect(test.getArg2()).to.equal('bar');
      done();
    });
  });
}); 