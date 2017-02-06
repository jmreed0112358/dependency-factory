# Dependency Factory

A quick Factory to produce dependencies, and obtain mocks for those dependencies.

### Installation.

````
npm install --save dependency-factory
````

## Testing.
Ensure you have mocha installed globally.  Chai is installed locally when installing npm install.

If needed:
````
npm install -g mocha
````
then run

````
npm test
````

### Usage.
First require the package, and create a new instance.
```` javascript
var DependencyFactory = require('dependency-factory'),
  factory = new DependencyFactory();
````

At first, the factory does not know about any dependences, we must register them before doing anything.

Keep in mind that the registery internally is shared among all instances of the dependency factory.  All instances of the dependency factory will know about all registered

### Registering dependencies.
To register a dependency, we give the factory a name, a path, and a type.
1. name: Any name we want to use for this specific dependency.
2. path: For dependencies installed via npm, this is just the package name.  For local modules, this will be a path to the module.  In other words, this is the string you'd be passing to require().
3. type: The factory can handle plain exported objects, or constructors to be used with the new keyword.  For the former, use 'object', for the latter, use 'constructor'.  All other values are ignored and will produce errors when getting the dependency from the factory.

For a dependency called foo, located at '../src/foo', exporting a plain object:
```` javascript
factory.registerDependency('foo', '../src/foo', 'object');
````

For a dependency called bar, npm package name 'Bar', with a constructor used with new:
```` javascript
factory.registerDependency('bar', 'Bar', 'constructor');
````

### Unregistering dependencies.
To unregister a dependency from the factory:
```` javascript
factory.unregisterDependency('foo');
````

To unregister ALL dependencies from the factory.
```` javascript
factory.unregisterAllDependencies();
````

### Mocking.
You can register mocks for specific dependencies using this factory.  Mocks can be plain objects decorated with whatever paramaters you want the mock to have.

## Registering mocks:

To register a mock (for dependency foo):
```` javascript
factory.registerMock('foo', {
  shout: function (string) {
    console.log(string);
  }
});
````

## Unregistering mocks:

Unregistering a mock returns the dependency's entry in the registery to its original state.

To unregister a mock (for dependency foo):
```` javascript
factory.unregisterMock('foo');
````