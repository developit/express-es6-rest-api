const assert = require('assert');
const util = require('../dist/lib/util');

describe('testDemoClass', function() {
  var testDemoClass = util.testDemoClass;
  describe('true is true', function() {
    it('should return true when true is provided', function() {
      assert.equal(testDemoClass.isTrue(true), true);
    });
  });
  describe('false is false', function() {
    it('should return false when false is provided', function() {
      assert.equal(testDemoClass.isTrue(false), false);
    });
  });
  describe('null is false', function() {
    it('should return false when null is provided', function() {
      assert.equal(testDemoClass.isTrue(), false);
    });
  });
  describe('null is true', function() {
    it('should return true when null is provided', function() {
      assert.equal(testDemoClass.isTrue(), false);
    });
  });
});
