'use strict';

var registry = {},
  DependencyFactory = function () {
};

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

DependencyFactory.prototype.unregisterDependency = function (depName) {
  if (typeof depName !== 'string') {
    throw new Error('Invalid type for depName');
  }

  if (registry[depName] !== undefined) {
    registry[depName] = null;
    delete registry[depName];
  }
};

DependencyFactory.prototype.unregisterAllDependencies = function () {
  let keys = Object.keys(registry);

  for (let i = 0 ; i < keys.length ; i++) {
    this.unregisterDependency(keys[i]);
  }
};

DependencyFactory.prototype.registerMock = function(depName, mock) {
  if (typeof depName !== 'string' || typeof mock !== 'object') {
    throw new Error('Invalid types for depName and/or mock');
  }

  if (registry[depName] !== undefined) {
    registry[depName].isMock = true;
    registry[depName].mock = mock;
  } else {
    throw new Error('The dependency must be registered before it can be mocked');
  }
};

DependencyFactory.prototype.unregisterMock = function(depName) {
  if (typeof depName !== 'string') {
    throw new Error('Invalid type for depName');
  }

  if (registry[depName] !== undefined && registry[depName].isMock) {
    registry[depName].isMock = false;
    registry[depName].mock = null;
  } else {
    throw new Error('Either the dependency is not registered, or there is no registered mock');
  }
};

DependencyFactory.prototype.isDependencyRegistered = function (depName) {
  return registry[depName] !== undefined;
};

DependencyFactory.prototype.getDependency = function (depName, args) {
  if (registry[depName]) {
    let dependency = registry[depName];

    if (dependency.isMock) {
      return dependency.mock;
    }

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

DependencyFactory.prototype.printRegistry = function () {
  console.log(registry);
};

module.exports = DependencyFactory;