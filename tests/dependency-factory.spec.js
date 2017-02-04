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

}); 