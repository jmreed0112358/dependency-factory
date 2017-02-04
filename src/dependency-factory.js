'use strict';

var registry = {},
  DependencyFactory = function () {};

/*
 * Registers dependencies in the registries.
 * depName: Key to use when referring to dependencies.
 * depPath: Path to dependency.  Used in require.
 *    Local dependency: Not installed via npm, referred to by an relative path.
 *    NPM installed dependency: Installed via npm, referred to by the module name.
 * depType: Is this a constructor function, or a plain exported javascript object?
 *
 */
DependencyFactory.prototype.registerDependency = function (depName, depPath, depType) {
  if (typeof depName !== 'string' || typeof depPath !== 'string' || typeof depType !== 'string') {
    throw new Error('Invalid types for depName, depPath, and/or depType');
  }

  if (registry[depName] === undefined) {
    registry[depName] = {
      name: depName,
      type: depType,
      path: depPath,
      isMock: false,
      mock: null
    };
  }
};

DependencyFactory.prototype.isDependencyRegistered = function (depName) {
  return registry[depName] !== undefined;
};

DependencyFactory.prototype.getDependency = function (depName, args) {
  if (registry[depName]) {
    let dependency = registry[depName];

    switch (dependency.type) {
      case 'constructor':
        let constructor = require(dependency.path);
        return this.callConstructor(constructor, args);
        break;
      case 'object':
        return require(dependency.path);
        break;
      default:
        throw new Error('Did not recogize the type');
        break;
    }
  }
}

// http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
// Taken from user123444555621's answer.
DependencyFactory.prototype.callConstructor = function (constructor, args) {
  return new (Function.prototype.bind.apply(constructor, [null].concat(args)));
};

module.exports = DependencyFactory;