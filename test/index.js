'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var mocha = require('mocha');
var Validator = require('../lib/validator');
var should = require('should');

describe('Schema', function () {
  describe('type', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    describe('numbers', function () {
      it('should validate a valid number', function () {
        this.validator.validate(0, {'type': 'number'}).should.be.true;
        this.validator.errors.should.have.length(0);
      });

      it('should not validate an invalid number', function () {
        return this.validator.validate('0', {'type': 'number'}).should.be.false;
      });
    });

    describe('null', function () {

      it('should validate null', function () {
        return this.validator.validate(null, {'type': 'null'}).should.be.true;
      });

      it('should not validate no-null', function () {
        return this.validator.validate('0', {'type': 'null'}).should.be.false;
      });
    });

    describe('date', function () {

      it('should validate date', function () {
        return this.validator.validate(new Date(), {'type': 'date'}).should.be.true;
      });

      it('should not validate no-null', function () {
        return this.validator.validate('0', {'type': 'date'}).should.be.false;
      });
    });

    describe('integer', function () {

      it('should validate integer', function () {
        return this.validator.validate(12, {'type': 'integer'}).should.be.true;
      });

      it('should not validate non integer', function () {
        return this.validator.validate(0.25, {'type': 'integer'}).should.be.false;
      });

    });

    describe('boolean', function () {

      it('should validate true', function () {
        return this.validator.validate(true, {'type': 'boolean'}).should.be.true;
      });

      it('should validate false', function () {
        return this.validator.validate(false, {'type': 'boolean'}).should.be.true;
      });

      it('should not validate non boolean', function () {
        return this.validator.validate('true', {'type': 'boolean'}).should.be.false;
      });
    });

    describe('any', function () {

      it('should validate true as any', function () {
        return this.validator.validate(true, {'type': 'any'}).should.be.true;
      });

      it('should validate "true" as any', function () {
        return this.validator.validate('true', {'type': 'any'}).should.be.true;
      });

      it('should validate 0 as any', function () {
        return this.validator.validate(0, {'type': 'any'}).should.be.true;
      });

      it('should validate Date as any', function () {
        return this.validator.validate(new Date(), {'type': 'any'}).should.be.true;
      });
    });
  });

  describe('minimum', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });
    it('should validate if number is above minumum', function () {
      return this.validator.validate(1, {'type': 'number', 'minimum': '1'}).should.be.true;
    });

    it('should not validate if number is below minumum', function () {
      return this.validator.validate(0, {'type': 'number', 'minimum': '1'}).should.be.false;
    });
  });

  describe('maximum', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });
    it('should validate if number is below the maximum', function () {
      return this.validator.validate(1, {'type': 'number', 'maximum': '2'}).should.be.true;
    });

    it('should not validate if number is above minumum', function () {
      return this.validator.validate(3, {'type': 'number', 'maximum': '2'}).should.be.false;
    });
  });


  describe('combined minumum and maximum', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });
    it('should validate if number is below the maximum', function () {
      return this.validator.validate(1, {'type': 'number', 'minimum': '1', 'maximum': '2'}).should.be.true;
    });

    it('should not validate if number is above minumum', function () {
      this.validator.validate(3, {'type': 'number', 'minimum': '1', 'maximum': '2'}).should.be.false;
      this.validator.errors.should.have.length(1);
    });
  });
});