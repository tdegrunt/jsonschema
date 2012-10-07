'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var mocha = require('mocha');
var Validator = require('../lib/validator');
var should = require('should');

describe('Arrays', function () {
  describe('simple array', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate an empty array', function () {
      this.validator.validate([], {'type': 'array', 'items': {'type': 'string'}}).should.be.empty;
    });

    it('should validate an undefined array', function () {
      this.validator.validate(undefined, {'type': 'array', 'items': {'type': 'string'}}).should.be.empty;
    });

    it('should validate an array with strings', function () {
      this.validator.validate(['1', '2', '3'], {'type': 'array', 'items': {'type': 'string'}}).should.be.empty;
    });

    it('should not validate an array not all strings', function () {
      this.validator.validate(['1', '2', '3', 4], {'type': 'array', 'items': {'type': 'string'}}).should.not.be.empty;
    });

    it('should not validate a non-array', function () {
      return this.validator.validate(0, {'type': 'array'}).should.not.be.empty;
    });
  });

  // Perhaps these should be tested in attributes, but they fit more with arrays
  describe('minItems', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if array has a length equal to minItems', function () {
      return this.validator.validate([1, 2, 3], {'type': 'array', 'items': {'type': 'number'}, 'minItems': 2}).should.be.empty;
    });

    it('should validate if array has a length equal to minItems', function () {
      return this.validator.validate([1, 2], {'type': 'array', 'items': {'type': 'number'}, 'minItems': 2}).should.be.empty;
    });

    it('should not validate if array has a length less than minItems', function () {
      return this.validator.validate([1], {'type': 'array', 'items': {'type': 'number'}, 'minItems': 2}).should.not.be.empty;
    });
  });

  describe('maxItems', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if array has a length less than maxItems', function () {
      return this.validator.validate([1], {'type': 'array', 'items': {'type': 'number'}, 'maxItems': 2}).should.be.empty;
    });

    it('should validate if array has a length equal to maxItems', function () {
      return this.validator.validate([1, 2], {'type': 'array', 'items': {'type': 'number'}, 'maxItems': 2}).should.be.empty;
    });

    it('should validate if array has a length larger than maxItems', function () {
      return this.validator.validate([1, 2, 3], {'type': 'array', 'items': {'type': 'number'}, 'maxItems': 2}).should.not.be.empty;
    });
  });

  describe('Unique', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if the array has a unique index property', function () {
      var jsonArray = [
        {index: 0},
        {index: 1},
      ];
      var jsonSchema = {
        'type': 'array',
        'items': {'type': 'object'},
        'uniqueField': 'index'
      };

      return this.validator.validate(jsonArray, jsonSchema).should.be.empty;
    });

    it('should not validate if the array does not have an unique index property', function () {
      var jsonArray = [
        {index: 0},
        {index: 1},
        {index: 0},
      ];
      var jsonSchema = {
        'type': 'array',
        'items': {'type': 'object'},
        'uniqueField': 'index'
      };

      return this.validator.validate(jsonArray, jsonSchema).should.not.be.empty;
    });

    it('should validate if the array does not have an unique index property', function () {
      var jsonArray = [
        {index: 0},
        {index: 1},
        {index: 0},
      ];
      var jsonSchema = {
        'type': 'array',
        'items': {'type': 'object'},
        'uniqueField': 'index'
      };

      return this.validator.validate(jsonArray, jsonSchema).should.not.be.empty;
    });
  });
});