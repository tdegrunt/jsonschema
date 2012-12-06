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
      ).should.be.empty;
    });
  });

  describe('simple object with array with invalid items', function () {
    it('should not validate', function () {
      var result = this.validator.validate(
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
      );
      result.should.have.length(1);
      result[0].should.have.property('validator', 'type');
      result[0].should.have.property('message', 'is not string');
      result[0].should.have.property('property', 'instance.lines[0]');
    });
  });

});
