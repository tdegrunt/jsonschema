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
        this.validator.validate(0, {'type': 'number'}).should.be.empty;
      });

      it('should not validate an invalid number', function () {
        return this.validator.validate('0', {'type': 'number'}).should.not.be.empty;
      });
    });

    describe('required', function () {
      it('should validate an undefined instance', function () {
        this.validator.validate(undefined, {'type': 'number', 'required': true}).should.not.be.empty;
      });
    });

    describe('null', function () {

      it('should validate null', function () {
        return this.validator.validate(null, {'type': 'null'}).should.be.empty;
      });

      it('should not validate no-null', function () {
        return this.validator.validate('0', {'type': 'null'}).should.not.be.empty;
      });
    });

    describe('date', function () {

      it('should validate date', function () {
        return this.validator.validate(new Date(), {'type': 'date'}).should.be.empty;
      });

      it('should not validate no-null', function () {
        return this.validator.validate('0', {'type': 'date'}).should.not.be.empty;
      });
    });

    describe('integer', function () {

      it('should validate integer', function () {
        return this.validator.validate(12, {'type': 'integer'}).should.be.empty;
      });

      it('should not validate non integer', function () {
        return this.validator.validate(0.25, {'type': 'integer'}).should.not.be.empty;
      });

    });

    describe('boolean', function () {

      it('should validate true', function () {
        return this.validator.validate(true, {'type': 'boolean'}).should.be.empty;
      });

      it('should validate false', function () {
        return this.validator.validate(false, {'type': 'boolean'}).should.be.empty;
      });

      it('should not validate non boolean', function () {
        return this.validator.validate('true', {'type': 'boolean'}).should.not.be.empty;
      });
    });

    describe('any', function () {

      it('should validate true as any', function () {
        return this.validator.validate(true, {'type': 'any'}).should.be.empty;
      });

      it('should validate "true" as any', function () {
        return this.validator.validate('true', {'type': 'any'}).should.be.empty;
      });

      it('should validate 0 as any', function () {
        return this.validator.validate(0, {'type': 'any'}).should.be.empty;
      });

      it('should validate Date as any', function () {
        return this.validator.validate(new Date(), {'type': 'any'}).should.be.empty;
      });
    });
  });

  describe('minimum', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if number meets minimum', function () {
      return this.validator.validate(1, {'type': 'number', 'minimum': '1'}).should.be.empty;
    });

    it('should not validate if number is below minimum', function () {
      return this.validator.validate(0, {'type': 'number', 'minimum': '1'}).should.not.be.empty;
    });

    it('should validate if number is above minimum, using exclusiveMinimum', function () {
      return this.validator.validate(2, {'type': 'number', 'minimum': '1', 'exclusiveMinimum': true}).should.be.empty;
    });

    it('should not validate if number is the minimum, using exclusiveMinimum', function () {
      return this.validator.validate(1, {'type': 'number', 'minimum': '1', 'exclusiveMinimum': true}).should.not.be.empty;
    });

  });

  describe('maximum', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if number is below the maximum', function () {
      return this.validator.validate(1, {'type': 'number', 'maximum': '2'}).should.be.empty;
    });

    it('should not validate if number is above maximum', function () {
      return this.validator.validate(3, {'type': 'number', 'maximum': '2'}).should.not.be.empty;
    });

    it('should validate if number is below maximum, using exclusiveMinimum', function () {
      return this.validator.validate(1, {'type': 'number', 'maximum': '2', 'exclusiveMaximum': true}).should.be.empty;
    });

    it('should not validate if number is the maximum, using exclusiveMinimum', function () {
      return this.validator.validate(2, {'type': 'number', 'maximum': '2', 'exclusiveMaximum': true}).should.not.be.empty;
    });

  });

  describe('combined minimum and maximum', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if number is below the maximum', function () {
      return this.validator.validate(1, {'type': 'number', 'minimum': '1', 'maximum': '2'}).should.be.empty;
    });

    it('should not validate if number is above minumum', function () {
      this.validator.validate(3, {'type': 'number', 'minimum': '1', 'maximum': '2'}).should.not.be.empty;
    });
  });

  describe('dividibleBy', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if 0 is even', function () {
      return this.validator.validate(2, {'type': 'number', 'divisibleBy': 2}).should.be.empty;
    });

    it('should validate if -2 is even', function () {
      return this.validator.validate(-2, {'type': 'number', 'divisibleBy': 2}).should.be.empty;
    });

    it('should not validate 1 is even', function () {
      return this.validator.validate(1, {'type': 'number', 'divisibleBy': 2}).should.not.be.empty;
    });
  });

  describe('pattern', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if string matches the string pattern', function () {
      return this.validator.validate('abbbc', {'type': 'string', 'pattern': 'ab+c'}).should.be.empty;
    });

    it('should validate if string matches the regexp pattern', function () {
      return this.validator.validate('abbbc', {'type': 'string', 'pattern': /ab+c/}).should.be.empty;
    });

    it('should validate if string does not match the string pattern', function () {
      return this.validator.validate('abac', {'type': 'string', 'pattern': 'ab+c'}).should.not.be.empty;
    });
  });

  describe('minLength', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if string has a length larger than minLength', function () {
      return this.validator.validate('abcde', {'type': 'string', 'minLength': 5}).should.be.empty;
    });

    it('should not validate if string does has a length less than minLength', function () {
      return this.validator.validate('abcde', {'type': 'string', 'minLength': 6}).should.not.be.empty;
    });
  });

  describe('maxLength', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if string has a length equal to maxLength', function () {
      return this.validator.validate('abcde', {'type': 'string', 'maxLength': 5}).should.be.empty;
    });

    it('should not validate if string does has a length larger than maxLength', function () {
      return this.validator.validate('abcde', {'type': 'string', 'maxLength': 4}).should.not.be.empty;
    });
  });

  describe('enum', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate if string is one of the enum values', function () {
      return this.validator.validate('abcde', {'type': 'string', 'enum': ['abcdf', 'abcde']}).should.be.empty;
    });

    it('should not validate if string is not one of the enum values', function () {
      return this.validator.validate('abcde', {'type': 'string', 'enum': ['abcdf', 'abcdd']}).should.not.be.empty;
    });

    it('should validate if number is one of the enum values', function () {
      return this.validator.validate(1, {'type': 'number', 'enum': [1, 2]}).should.be.empty;
    });

    it('should not validate if number is not one of the enum values', function () {
      return this.validator.validate(3, {'type': 'string', 'enum': [1, 2]}).should.not.be.empty;
    });

  });

  describe('description', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should be ignored', function () {
      this.validator.validate(1, {'description': 'some text'}).should.be.empty;
    });
  });

  describe('disallow', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should prohibit specified types', function () {
      this.validator.validate(1, {'type': 'any', 'disallow':'array'}).should.be.empty;
    });

    it('should not prohibit unprohibited types', function () {
      this.validator.validate(1, {'type':'any', 'disallow':'array'}).should.be.empty;
    });
  });

  describe('dependencies', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('should validate with missing non-depended properties', function () {
      this.validator.validate({foo: 1}, {'dependencies': {'quux': ['foo', 'bar']}}).should.be.empty;
    });

    it('should not validate with missing dependencies', function () {
      this.validator.validate({quux: 1, foo: 1}, {'dependencies': {'quux': ['foo', 'bar']}}).should.not.be.empty;
    });

    it('should validate with satisfied dependencies', function () {
      this.validator.validate({quux: 1, foo: 1, bar: 1}, {'dependencies': {'quux': ['foo', 'bar']}}).should.be.empty;
    });    
  });
});
