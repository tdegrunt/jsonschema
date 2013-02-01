'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var Validator = require('../lib/validator');
var should = require('chai').should();

describe('Arrays', function () {
  describe('simple array', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate an empty array', function () {
      this.validator.validate([], {'type': 'array', 'items': {'type': 'string'}});
    });

    it('should validate an undefined array', function () {
      this.validator.validate(undefined, {'type': 'array', 'items': {'type': 'string'}}).valid.should.be.true;
    });

    it('should validate an array with strings', function () {
      this.validator.validate(['1', '2', '3'], {'type': 'array', 'items': {'type': 'string'}}).valid.should.be.true;
    });

    it('should not validate an array not all strings', function () {
      this.validator.validate(['1', '2', '3', 4], {'type': 'array', 'items': {'type': 'string'}}).valid.should.be.false;
    });

    it('should not validate a non-array', function () {
      return this.validator.validate(0, {'type': 'array'}).valid.should.be.false;
    });
  });

  // Perhaps these should be tested in attributes, but they fit more with arrays
  describe('minItems', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if array has a length equal to minItems', function () {
      return this.validator.validate([1, 2, 3], {'type': 'array', 'items': {'type': 'number'}, 'minItems': 2}).valid.should.be.true;
    });

    it('should validate if array has a length equal to minItems', function () {
      return this.validator.validate([1, 2], {'type': 'array', 'items': {'type': 'number'}, 'minItems': 2}).valid.should.be.true;
    });

    it('should not validate if array has a length less than minItems', function () {
      return this.validator.validate([1], {'type': 'array', 'items': {'type': 'number'}, 'minItems': 2}).valid.should.be.false;
    });
  });

  describe('maxItems', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if array has a length less than maxItems', function () {
      return this.validator.validate([1], {'type': 'array', 'items': {'type': 'number'}, 'maxItems': 2}).valid.should.be.true;
    });

    it('should validate if array has a length equal to maxItems', function () {
      return this.validator.validate([1, 2], {'type': 'array', 'items': {'type': 'number'}, 'maxItems': 2}).valid.should.be.true;
    });

    it('should validate if array has a length larger than maxItems', function () {
      return this.validator.validate([1, 2, 3], {'type': 'array', 'items': {'type': 'number'}, 'maxItems': 2}).valid.should.be.false;
    });
  });

  describe('uniqueItems', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if array has no duplicate items', function () {
      return this.validator.validate([1], {'type': 'array', 'uniqueItems': true}).valid.should.be.true;
    });

    it('should validate if array has no duplicate objects', function () {
      return this.validator.validate([1, 2, "1", "2", {a:1}, {a:1, b:1}], {'type': 'array', 'uniqueItems': true}).valid.should.be.true;
    });

    it('should not validate if array has duplicate numbers', function () {
      return this.validator.validate([1, 2, 4, 1, 3, 5], {'type': 'array', 'uniqueItems': true}).valid.should.be.false;
    });

    it('should not validate if array has duplicate objects', function () {
      return this.validator.validate([{a:1}, {a:1}], {'type': 'array', 'uniqueItems': true}).valid.should.be.false;
    });

    it('should validate if not an Array', function () {
      return this.validator.validate(null, {'type': 'any', 'uniqueItems': true}).valid.should.be.true;
    });
  });
});
