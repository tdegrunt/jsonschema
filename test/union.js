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
    this.validator.validate(1, {'type': ['number', 'string']}).should.be.true;
    this.validator.errors.should.have.length(0);
  });
  it('should validate for string', function () {
    this.validator.validate('1', {'type': ['number', 'string']}).should.be.true;
    this.validator.errors.should.have.length(0);
  });

  it('should not validate if no string or number', function () {
    this.validator.validate(true, {'type': ['number', 'string']}).should.be.false;
    this.validator.errors.should.have.length(1);
  });
  });

  describe('string and null', function () {
    it('should validate for null', function () {
      this.validator.validate(null, {'type': ['null', 'string']}).should.be.true;
      this.validator.errors.should.have.length(0);
    });
    it('should validate for string', function () {
      this.validator.validate('1', {'type': ['null', 'string']}).should.be.true;
      this.validator.errors.should.have.length(0);
    });

    it('should not validate if no string or number', function () {
      this.validator.validate(true, {'type': ['null', 'string']}).should.be.false;
      this.validator.errors.should.have.length(1);
    });
  });

  describe('string and null', function () {
    it('should validate for null', function () {
      this.validator.validate(null, {'type': ['null', 'string']}).should.be.true;
      this.validator.errors.should.have.length(0);
    });
    it('should validate for string', function () {
      this.validator.validate('1', {'type': ['null', 'string']}).should.be.true;
      this.validator.errors.should.have.length(0);
    });

    it('should not validate if no string or number', function () {
      this.validator.validate(true, {'type': ['null', 'string']}).should.be.false;
      this.validator.errors.should.have.length(1);
    });
  });

  describe('null and $ref', function () {
    it('should validate for null', function () {
      this.validator.validate(null, {'type': ['null', {'$ref':'Test#Simple'}]}).should.be.true;
      this.validator.errors.should.have.length(0);
    });

    it('should validate for string', function () {
      this.validator.validate('test', {'type': ['null', {'$ref':'Test#Simple'}]}).should.be.true;
      this.validator.errors.should.have.length(0);
    });

    it('should not validate if no string or number', function () {
      this.validator.validate(true, {'type': ['null', {'$ref':'Test#Simple'}]}).should.be.false;
      this.validator.errors.should.have.length(1);
    });
  });
});