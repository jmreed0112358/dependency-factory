'use strict';

var Test = function (arg1, arg2) {
  this.arg1 = arg1;
  this.arg2 = arg2;
};

Test.prototype.getArg1 = function() {
  return this.arg1;
};

Test.prototype.getArg2 = function() {
  return this.arg2;
};

Test.prototype.printArgs = function() {
  console.log('this.arg1: ', this.arg1);
  console.log('this.arg2: ', this.arg2);
};

module.exports = Test;