'use strict';

var registry = {},
  DependencyFactory = function () {};

DependencyFactory.prototype.registerDependency = function (depName, depPath) {
  if (typeof depName !== 'string' || typeof depPath !== 'string') {
    throw new Error('Invalid types for depName and/or depPath');
  }

  if (registry[depName] === undefined) {
    registry[depName] = {
      name: depName,
      path: depPath,
      isMock: false,
      mock: null
    };
  }
};

DependencyFactory.prototype.isDependencyRegistered = function (depName) {
  return registry[depName] !== undefined;
};

DependencyFactory.prototype.getDependency = function (depName) {
  if (registry[depName]) {
    let dependency = registry[depName];

    return require(dependency.path);
  }
}

module.exports = DependencyFactory;