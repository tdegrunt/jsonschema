'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var mocha = require('mocha');
var Validator = require('../lib/validator');
var should = require('should');

describe('Union', function () {
  beforeEach(function () {
    this.validator = new Validator();
    var testSchema = {
      "type" : "string",
    };

    this.validator.addSchema(testSchema, 'Test#Simple');
  });

  describe('string and number', function () {
  it('should validate for number', function () {
    this.validator.validate(1, {'type': ['number', 'string']}).should.be.empty;
  });
  it('should validate for string', function () {
    this.validator.validate('1', {'type': ['number', 'string']}).should.be.empty;
  });

  it('should not validate if no string or number', function () {
    this.validator.validate(true, {'type': ['number', 'string']}).should.not.be.empty;
  });
  });

  describe('string and null', function () {
    it('should validate for null', function () {
      this.validator.validate(null, {'type': ['null', 'string']}).should.be.empty;
      });
    it('should validate for string', function () {
      this.validator.validate('1', {'type': ['null', 'string']}).should.be.empty;
      });

    it('should not validate if no string or number', function () {
      this.validator.validate(true, {'type': ['null', 'string']}).should.not.be.empty;
      });
  });

  describe('string and null', function () {
    it('should validate for null', function () {
      this.validator.validate(null, {'type': ['null', 'string']}).should.be.empty;
      });
    it('should validate for string', function () {
      this.validator.validate('1', {'type': ['null', 'string']}).should.be.empty;
      });

    it('should not validate if no string or number', function () {
      this.validator.validate(true, {'type': ['null', 'string']}).should.not.be.empty;
      });
  });

  describe('null and $ref', function () {
    it('should validate for null', function () {
      this.validator.validate(null, {'type': ['null', {'$ref':'Test#Simple'}]}).should.be.empty;
      });

    it('should validate for string', function () {
      this.validator.validate('test', {'type': ['null', {'$ref':'Test#Simple'}]}).should.be.empty;
      });

    it('should not validate if no string or number', function () {
      this.validator.validate(true, {'type': ['null', {'$ref':'Test#Simple'}]}).should.not.be.empty;
      });
  });
});