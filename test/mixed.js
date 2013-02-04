'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var Validator = require('../lib/validator');
var should = require('chai').should();

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
      ).valid.should.be.true;
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
      result.errors.should.have.length(1);
      result.errors[0].should.have.property('message', 'is not of a type(s) string');
      result.errors[0].should.have.property('property', 'instance.lines[0]');
    });
  });

});
