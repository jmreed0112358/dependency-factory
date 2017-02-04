'use strict';

const DependencyFactory = require('../src/dependency-factory'),
  Test = require('../src/test-module'),
  chai = require('chai'),
  expect = chai.expect;


describe('DependencyFactory', function() {
  describe('registerDependency()', function() {
    it('should register dependencies correctly', function(done) {
      let factory = new DependencyFactory();

      factory.registerDependency('foo', 'foo', 'object');

      expect(factory.isDependencyRegistered('foo')).to.equal(true);
      done();
    });

    it('should throw Error when given non-string input for depName', function(done) {
      let factory = new DependencyFactory();

      expect(function () {
        factory.registerDependency(42, 'foo');
      }).to.throw('Invalid types for depName, depPath, and/or depType');
      done();
    });

    it('should throw Error when given non-string input for depName', function(done) {
      let factory = new DependencyFactory();

      expect(function () {
        factory.registerDependency('foo', 42);
      }).to.throw('Invalid types for depName, depPath, and/or depType');
      done();
    });
  });

  describe('getDependency()', function() {
    it('should get a local constructor dependency correctly', function(done) {
      let factory = new DependencyFactory(),
        Factory = null,
        test = null;

      factory.registerDependency('DependencyFactory', '../src/dependency-factory', 'constructor');

      expect(factory.isDependencyRegistered('DependencyFactory')).to.equal(true);

      test = factory.getDependency('DependencyFactory');

      expect(test instanceof DependencyFactory).to.equal(true);
      done();
    });

    it('should get a npm installed object dependency correctly', function(done) {
      let factory = new DependencyFactory(),
        validator = null;

      factory.registerDependency('validator', 'validator', 'object');

      expect(factory.isDependencyRegistered('validator')).to.equal(true);

      validator = factory.getDependency('validator');

      expect(validator.isEmail('foo@bar.com')).to.equal(true);
      done();
    });

    it('should get a local constructor dependency with args correctly', function(done) {
      let factory = new DependencyFactory(),
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

  describe('registerMock()', function() {
    it('should register a mock properly', function(done) {
      let factory = new DependencyFactory(),
        test = null;

      factory.registerDependency('Test', '../src/test-module', 'constructor');

      expect(factory.isDependencyRegistered('Test')).to.equal(true);

      test = factory.getDependency('Test', ['foo', 'bar']);

      expect(test instanceof Test).to.equal(true);
      expect(test.getArg1()).to.equal('foo');
      expect(test.getArg2()).to.equal('bar');

      factory.registerMock('Test', {
        thing: 'something'
      });

      test = factory.getDependency('Test', ['foo', 'bar']);

      expect(test.thing).to.equal('something');
      done();
    });

    it('should throw error when given bad depName', function(done) {
      let factory = new DependencyFactory(),
        test = null;

      factory.registerDependency('Test', '../src/test-module', 'constructor');

      expect(factory.isDependencyRegistered('Test')).to.equal(true);

      expect(function() {
        factory.registerMock(99, {
          thing: 'something'
        });
      }).to.throw('Invalid types for depName and/or mock')
      
      done();
    });

    it('should throw error when given bad mock object', function(done) {
      let factory = new DependencyFactory(),
        test = null;

      factory.registerDependency('Test', '../src/test-module', 'constructor');

      expect(factory.isDependencyRegistered('Test')).to.equal(true);

      expect(function() {
        factory.registerMock('Test', 'foo');
      }).to.throw('Invalid types for depName and/or mock')
      
      done();
    });

    it('should throw error when the dependency is not registered', function(done) {
      let factory = new DependencyFactory(),
        test = null;

      expect(factory.isDependencyRegistered('Test')).to.equal(false);

      expect(function() {
        factory.registerMock('Test', {
          thing: 'other'
        });
      }).to.throw('The dependency must be registered before it can be mocked')
      
      done();
    });
  });

  describe('unregisterMock()', function() {
    it('should unregister a mock properly', function(done) {
      let factory = new DependencyFactory(),
        test = null;

      factory.registerDependency('Test', '../src/test-module', 'constructor');

      expect(factory.isDependencyRegistered('Test')).to.equal(true);

      test = factory.getDependency('Test', ['foo', 'bar']);

      expect(test instanceof Test).to.equal(true);
      expect(test.getArg1()).to.equal('foo');
      expect(test.getArg2()).to.equal('bar');

      factory.registerMock('Test', {
        thing: 'something'
      });

      test = factory.getDependency('Test', ['foo', 'bar']);

      expect(test.thing).to.equal('something');

      factory.unregisterMock('Test');

      test = factory.getDependency('Test', ['foo', 'bar']);

      expect(test instanceof Test).to.equal(true);
      expect(test.getArg1()).to.equal('foo');
      expect(test.getArg2()).to.equal('bar');

      done();
    });

    it('should throw error when given bad depName', function (done) {
      let factory = new DependencyFactory(),
        test = null;

      factory.registerDependency('Test', '../src/test-module', 'constructor');

      expect(factory.isDependencyRegistered('Test')).to.equal(true);

      test = factory.getDependency('Test', ['foo', 'bar']);

      expect(test instanceof Test).to.equal(true);
      expect(test.getArg1()).to.equal('foo');
      expect(test.getArg2()).to.equal('bar');

      factory.registerMock('Test', {
        thing: 'something'
      });

      test = factory.getDependency('Test', ['foo', 'bar']);

      expect(test.thing).to.equal('something');

      expect(function() {
        factory.unregisterMock(99);
      }).to.throw('Invalid type for depName')

      done();
    });

    it('should throw error when the dependency is not registered', function (done) {
      let factory = new DependencyFactory(),
        test = null;

      expect(function() {
        factory.unregisterMock('Test');
      }).to.throw('Either the dependency is not registered, or there is no registered mock')
      
      done();
    });

    it('should throw error when the dependency has no registered mock', function (done) {
      let factory = new DependencyFactory(),
        test = null;

      factory.registerDependency('Test', '../src/test-module', 'constructor');

      expect(factory.isDependencyRegistered('Test')).to.equal(true);

      test = factory.getDependency('Test', ['foo', 'bar']);

      expect(test instanceof Test).to.equal(true);
      expect(test.getArg1()).to.equal('foo');
      expect(test.getArg2()).to.equal('bar');

      expect(function() {
        factory.unregisterMock('Test');
      }).to.throw('Either the dependency is not registered, or there is no registered mock')

      done();
    });
  });
}); 