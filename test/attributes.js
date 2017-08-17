'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var Validator = require('../lib/validator');
var should = require('chai').should();

describe('Attributes', function () {
  describe('type', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    describe('number', function () {
      it('should validate a valid number', function () {
        this.validator.validate(0, {'type': 'number'}).valid.should.be.true;
      });

      it('should not validate an invalid number', function () {
        return this.validator.validate('0', {'type': 'number'}).valid.should.be.false;
      });

      it('should not validate NaN', function () {
        return this.validator.validate(NaN, {'type': 'number'}).valid.should.be.false;
      });

      it('should not validate Infinity', function () {
        return this.validator.validate(Infinity, {'type': 'number'}).valid.should.be.false;
      });

      it('should not validate -Infinity', function () {
        return this.validator.validate(-Infinity, {'type': 'number'}).valid.should.be.false;
      });

    });

    describe('required', function () {
      it('should not validate an undefined instance', function () {
        this.validator.validate(undefined, {'type': 'number', 'required': true}).valid.should.be.false;
      });
    });

    describe('null', function () {

      it('should validate null', function () {
        return this.validator.validate(null, {'type': 'null'}).valid.should.be.true;
      });

      it('should not validate no-null', function () {
        return this.validator.validate('0', {'type': 'null'}).valid.should.be.false;
      });

      // I don't know - strictly undefined should not be a valid null
      it('should not validate an undefined instance', function () {
        this.validator.validate(undefined, {'type': 'date', 'required': true}).valid.should.be.false;
      });
    });

    describe('date', function () {

      it('should validate date', function () {
        return this.validator.validate(new Date(), {'type': 'date'}).valid.should.be.true;
      });

      it('should not validate no-null', function () {
        return this.validator.validate('0', {'type': 'date'}).valid.should.be.false;
      });

      it('should not validate an undefined instance', function () {
        this.validator.validate(undefined, {'type': 'date', 'required': true}).valid.should.be.false;
      });
    });

    describe('integer', function () {

      it('should validate integer', function () {
        return this.validator.validate(12, {'type': 'integer'}).valid.should.be.true;
      });

      it('should not validate non integer', function () {
        return this.validator.validate(0.25, {'type': 'integer'}).valid.should.be.false;
      });

      it('should not validate an undefined instance', function () {
        this.validator.validate(undefined, {'type': 'integer', 'required': true}).valid.should.be.false;
      });
    });

    describe('boolean', function () {

      it('should validate true', function () {
        return this.validator.validate(true, {'type': 'boolean'}).valid.should.be.true;
      });

      it('should validate false', function () {
        return this.validator.validate(false, {'type': 'boolean'}).valid.should.be.true;
      });

      it('should not validate non boolean', function () {
        return this.validator.validate('true', {'type': 'boolean'}).valid.should.be.false;
      });

      it('should not validate an undefined instance', function () {
        this.validator.validate(undefined, {'type': 'boolean', 'required': true}).valid.should.be.false;
      });
    });

    describe('any', function () {

      it('should validate true as any', function () {
        return this.validator.validate(true, {'type': 'any'}).valid.should.be.true;
      });

      it('should validate "true" as any', function () {
        return this.validator.validate('true', {'type': 'any'}).valid.should.be.true;
      });

      it('should validate 0 as any', function () {
        return this.validator.validate(0, {'type': 'any'}).valid.should.be.true;
      });

      it('should validate Date as any', function () {
        return this.validator.validate(new Date(), {'type': 'any'}).valid.should.be.true;
      });

      it('should not validate an undefined instance', function () {
        this.validator.validate(undefined, {'type': 'any', 'required': true}).valid.should.be.false;
      });
    });
  });

  describe('minimum', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if number meets minimum', function () {
      return this.validator.validate(1, {'type': 'number', 'minimum': '1'}).valid.should.be.true;
    });

    it('should not validate if number is below minimum', function () {
      return this.validator.validate(0, {'type': 'number', 'minimum': '1'}).valid.should.be.false;
    });

    it('should validate if number is above minimum, using exclusiveMinimum', function () {
      return this.validator.validate(2, {'type': 'number', 'minimum': '1', 'exclusiveMinimum': true}).valid.should.be.true;
    });

    it('should not validate if number is the minimum, using exclusiveMinimum', function () {
      return this.validator.validate(1, {'type': 'number', 'minimum': '1', 'exclusiveMinimum': true}).valid.should.be.false;
    });

  });

  describe('maximum', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if number is below the maximum', function () {
      return this.validator.validate(1, {'type': 'number', 'maximum': '2'}).valid.should.be.true;
    });

    it('should not validate if number is above maximum', function () {
      return this.validator.validate(3, {'type': 'number', 'maximum': '2'}).valid.should.be.false;
    });

    it('should validate if number is below maximum, using exclusiveMinimum', function () {
      return this.validator.validate(1, {'type': 'number', 'maximum': '2', 'exclusiveMaximum': true}).valid.should.be.true;
    });

    it('should not validate if number is the maximum, using exclusiveMinimum', function () {
      return this.validator.validate(2, {'type': 'number', 'maximum': '2', 'exclusiveMaximum': true}).valid.should.be.false;
    });

  });

  describe('combined minimum and maximum', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if number is below the maximum', function () {
      return this.validator.validate(1, {'type': 'number', 'minimum': '1', 'maximum': '2'}).valid.should.be.true;
    });

    it('should not validate if number is above minumum', function () {
      this.validator.validate(3, {'type': 'number', 'minimum': '1', 'maximum': '2'}).valid.should.be.false;
    });
  });

  describe('divisibleBy', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if 0 is even', function () {
      return this.validator.validate(2, {'type': 'number', 'divisibleBy': 2}).valid.should.be.true;
    });

    it('should validate if -2 is even', function () {
      return this.validator.validate(-2, {'type': 'number', 'divisibleBy': 2}).valid.should.be.true;
    });

    it('should not validate 1 is even', function () {
      return this.validator.validate(1, {'type': 'number', 'divisibleBy': 2}).valid.should.be.false;
    });

    it('should validate divisibleBy with decimals', function () {
      return this.validator.validate(2.4, {'type': 'number', 'divisibleBy': 0.1}).valid.should.be.true;
    });
  });

  describe('multipleOf', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if 0 is even', function () {
      return this.validator.validate(2, {'type': 'number', 'multipleOf': 2}).valid.should.be.true;
    });

    it('should validate if -2 is even', function () {
      return this.validator.validate(-2, {'type': 'number', 'multipleOf': 2}).valid.should.be.true;
    });

    it('should not validate 1 is even', function () {
      return this.validator.validate(1, {'type': 'number', 'multipleOf': 2}).valid.should.be.false;
    });

    it('should validate mutlipleOf with decimals', function () {
      return this.validator.validate(2.4, {'type': 'number', 'multipleOf': 0.1}).valid.should.be.true;
    });
  });

  describe('pattern', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if string matches the string pattern', function () {
      return this.validator.validate('abbbc', {'type': 'string', 'pattern': 'ab+c'}).valid.should.be.true;
    });

    it('should validate if string matches the regexp pattern', function () {
      return this.validator.validate('abbbc', {'type': 'string', 'pattern': /ab+c/}).valid.should.be.true;
    });

    it('should validate if string does not match the string pattern', function () {
      return this.validator.validate('abac', {'type': 'string', 'pattern': 'ab+c'}).valid.should.be.false;
    });
  });

  describe('minLength', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if string has a length larger than minLength', function () {
      return this.validator.validate('abcde', {'type': 'string', 'minLength': 5}).valid.should.be.true;
    });

    it('should not validate if string does has a length less than minLength', function () {
      return this.validator.validate('abcde', {'type': 'string', 'minLength': 6}).valid.should.be.false;
    });
  });

  describe('maxLength', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if string has a length equal to maxLength', function () {
      return this.validator.validate('abcde', {'type': 'string', 'maxLength': 5}).valid.should.be.true;
    });

    it('should not validate if string does has a length larger than maxLength', function () {
      return this.validator.validate('abcde', {'type': 'string', 'maxLength': 4}).valid.should.be.false;
    });
  });

  describe('enum', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if string is one of the enum values', function () {
      return this.validator.validate('abcde', {'type': 'string', 'enum': ['abcdf', 'abcde']}).valid.should.be.true;
    });

    it('should not validate if string is not one of the enum values', function () {
      return this.validator.validate('abcde', {'type': 'string', 'enum': ['abcdf', 'abcdd']}).valid.should.be.false;
    });

    it('should validate if number is one of the enum values', function () {
      return this.validator.validate(1, {'type': 'number', 'enum': [1, 2]}).valid.should.be.true;
    });

    it('should not validate if number is not one of the enum values', function () {
      return this.validator.validate(3, {'type': 'string', 'enum': [1, 2]}).valid.should.be.false;
    });

    it('should validate if value is undefined but defaults to one of the enum values', function () {
      return this.validator.validate(undefined, {'enum': ['foo', 'bar', 'baz'], 'default': 'baz'}).valid.should.be.true;
    });

    it('should not validate if value is undefined and required, even if a default is given', function () {
      return this.validator.validate(undefined, {'enum': ['foo', 'bar', 'baz'], 'required': true, 'default': 'baz'}).valid.should.be.false;
    });

    it('should not validate if a required field is ommited', function () {
      return this.validator.validate({}, {'type': 'object', 'properties':{'the_field': {'enum': ['foo', 'bar', 'baz'], 'required': true}}}).valid.should.be.false;
    });

    it('should not validate if a required field is undefined', function () {
      return this.validator.validate({'the_field':undefined}, {'type': 'object', 'properties':{'the_field': {'enum': ['foo', 'bar', 'baz'], 'required': true}}}).valid.should.be.false;
    });

    it('should validate if a required field has a value out of enum', function () {
      return this.validator.validate({'the_field':'bar'}, {'type': 'object', 'properties':{'the_field': {'enum': ['foo', 'bar', 'baz'], 'required': true}}}).valid.should.be.true;
    });
  });

  describe('description', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should be ignored', function () {
      this.validator.validate(1, {'description': 'some text'}).valid.should.be.true;
    });
  });

  describe('disallow', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should prohibit specified types', function () {
      this.validator.validate(1, {'type': 'any', 'disallow':'array'}).valid.should.be.true;
    });

    it('should not prohibit unprohibited types', function () {
      this.validator.validate(1, {'type':'any', 'disallow':'array'}).valid.should.be.true;
    });
  });

  describe('dependencies', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate with missing non-depended properties', function () {
      this.validator.validate({foo: 1}, {'dependencies': {'quux': ['foo', 'bar']}}).valid.should.be.true;
    });

    it('should not validate with missing dependencies', function () {
      this.validator.validate({quux: 1, foo: 1}, {'dependencies': {'quux': ['foo', 'bar']}}).valid.should.be.false;
    });

    it('should validate with satisfied dependencies', function () {
      this.validator.validate({quux: 1, foo: 1, bar: 1}, {'dependencies': {'quux': ['foo', 'bar']}}).valid.should.be.true;
    });
  });
});
