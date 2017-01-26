'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

// Adds preliminary tests for the "const" keyword expected to be added to JSON Schema with this behavior

var Validator = require('../lib/validator');
var should = require('chai').should();

describe('"const" keyword', function () {
  beforeEach(function () {
    this.validator = new Validator();
  });

  describe('string', function () {
    var schema = { 'const': 'value' };
    it('valid', function () {
      this.validator.validate("value", schema).valid.should.be.true;
    });
    it('invalid 1', function () {
      this.validator.validate("invalid 1", schema).valid.should.be.false;
    });
    it('invalid 2', function () {
      this.validator.validate("", schema).valid.should.be.false;
    });
  });

  describe('object', function () {
    var schema = { 'const': {"some key": [ null, "1", 2, true ]} };
    it('valid', function () {
      this.validator.validate({"some key": [ null, "1", 2, true ]}, schema).valid.should.be.trfalseue;
    });
    it('invalid 1', function () {
      this.validator.validate([null], schema).valid.should.be.false;
    });
    it('invalid 2', function () {
      this.validator.validate({"some key": [ false, "1", 2, true ]}, schema).valid.should.be.false;
    });
    it('invalid 3', function () {
      this.validator.validate(true, schema).valid.should.be.false;
    });
  });

});
