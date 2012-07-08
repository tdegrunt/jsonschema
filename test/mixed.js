'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var mocha = require('mocha');
var Validator = require('../lib/validator');
var should = require('should');

describe('Mixed', function () {
  beforeEach(function () {
    this.validator = new Validator();
  });

  describe('simple object with array', function () {
    it('should validate', function () {
      this.validator.validate(
        {'name':'test', 'lines': ['1']},
        {
          'type': 'object',
          'properties': {
            'name': {'type': 'string'},
            'lines': {
              'type': 'array',
              'items': {'type': 'string'}
            }
          }
        }
      ).should.be.true;
      this.validator.errors.should.have.length(0);
    });
  });

  describe('simple object with array with invalid items', function () {
    it('should not validate', function () {
      this.validator.validate(
        {'name':'test', 'lines': [1]},
        {
          'type': 'object',
          'properties': {
            'name': {'type': 'string'},
            'lines': {
              'type': 'array',
              'items': {'type': 'string'}
            }
          }
        }
      ).should.be.false;
      this.validator.errors.should.have.length(1);
      this.validator.errors[0].should.have.property('validator', 'type');
      this.validator.errors[0].should.have.property('message', 'is not string');
      this.validator.errors[0].should.have.property('property', 'lines');
    });
  });

});