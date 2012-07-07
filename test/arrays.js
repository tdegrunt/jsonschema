'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var mocha = require('mocha');
var Validator = require('../lib/validator');
var should = require('should');

describe('Arrays', function () {
  beforeEach(function () {
    this.validator = new Validator();
  });

  describe('simple array', function () {
    it('should validate an empty array', function () {
      this.validator.validate([], {'type': 'array', 'items': {'type': 'string'}}).should.be.true;
      this.validator.errors.should.have.length(0);
    });

    it('should validate an array with strings', function () {
      this.validator.validate(['1', '2', '3'], {'type': 'array', 'items': {'type': 'string'}}).should.be.true;
      this.validator.errors.should.have.length(0);
    });

    it('should not validate an array not all strings', function () {
      this.validator.validate(['1', '2', '3', 4], {'type': 'array', 'items': {'type': 'string'}}).should.be.false;
      this.validator.errors.should.have.length(1);
    });

    it('should not validate a non-array', function () {
      return this.validator.validate(0, {'type': 'array'}).should.be.false;
    });
  });

});