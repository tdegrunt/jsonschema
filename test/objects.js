'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var mocha = require('mocha');
var Validator = require('../lib/validator');
var should = require('should');

describe('Objects', function () {
  beforeEach(function () {
    this.validator = new Validator();
  });

  describe('simple object', function () {
    it('should validate a valid object', function () {
      this.validator.validate({}, {'type': 'object'}).should.be.empty;
    });

    it('should validate an undefined object', function () {
      this.validator.validate(undefined, {'type': 'object'}).should.be.empty;
    });

    it('should not validate a number', function () {
      return this.validator.validate(0, {'type': 'object'}).should.not.be.empty;
    });

    it('should not validate an array', function () {
      return this.validator.validate([0], {'type': 'object'}).should.not.be.empty;
    });
  });

  describe('object with property', function () {
    it('should validate a valid object', function () {
      this.validator.validate(
        {'name': 'test'},
        {
          'type': 'object',
          'properties': {
            'name': {'type': 'string'}
          }
        }
      ).should.be.empty;
    });

    it('should not validate an invalid object', function () {
      return this.validator.validate(0, {'type': 'object'}).should.not.be.empty;
    });
  });

  describe('object with properties', function () {
    it('should validate a valid object with multiple properties', function () {
      this.validator.validate(
        {'name': 'test', 'address': 'someplace'},
        {
          'type': 'object',
          'properties': {
            'name': {'type': 'string'},
            'address': {'type': 'string'}
          }
        }
      ).should.be.empty;
    });

    it('should validate a valid object with undefined property', function () {
      this.validator.validate(
        {'name': 'test'},
        {
          'type': 'object',
          'properties': {
            'name': {'type': 'string'},
            'address': {'type': 'string'}
          }
        }
      ).should.be.empty;
    });

  });

  describe('nested object with property', function () {
    it('should NOT validate a valid object', function () {
      this.validator.validate(
        {'name': 'test', 'nested': 'test2'},
        {
          'type': 'object',
          'properties': {
            'name': {'type': 'string'},
            'nested': {'type': 'object'}
          }
        }
      ).should.not.be.empty;
    });

    it('should validate a valid object', function () {
      this.validator.validate(
        {'name': 'test', 'nested': 'test2'},
        {
          'type': 'object',
          'properties': {
            'name': {'type': 'string'},
            'nested': {'type': 'string'}
          }
        }
      ).should.be.empty;
    });
  });

  describe('undefined but required object', function () {
    it('should NOT validate an undefined object', function () {
      var ret = this.validator.validate(
        {'foo': {'baz': 1}},
        {
          'type': 'object',
          'required': true,
          'properties': {
            'foo': {
              'type': 'object',
              'required': true,
              'properties': {
                'bar': {'type': 'object', 'required': true},
                'baz': {'type': 'number', 'required': true}
              }
            }
          }
        }
      ).should.not.be.empty;
    });
  });

  describe('additionalProperties', function () {
    it('should validate if there are no additionalProperties', function () {
      this.validator.validate(
        {'name': 'test', 'nested': 'test2'},
        {
          'type': 'object',
          'properties': {
            'name': {'type': 'string'},
            'nested': {'type': 'string'}
          },
          'additionalProperties': false
        }
      ).should.be.empty;
    });

    it('should not validate if there are additionalProperties', function () {
      this.validator.validate(
        {'name': 'test', 'nested': 'test2', 'extraProp': 1},
        {
          'type': 'object',
          'properties': {
            'name': {'type': 'string'},
            'nested': {'type': 'string'}
          },
          'additionalProperties': false
        }
      ).should.not.be.empty;
    });

    it('should validate if the additionalProperties are compliant with additionalProperties', function () {
      this.validator.validate(
        {'name': 'test', 'nested': 'test2', 'extraProp': 1},
        {
          'type': 'object',
          'properties': {
            'name': {'type': 'string'},
            'nested': {'type': 'string'}
          },
          'additionalProperties': {'type': 'number'}
        }
      ).should.be.empty;
    });

    it('should not validate if the additionalProperties are not compliant with additionalProperties', function () {
      this.validator.validate(
        {'name': 'test', 'nested': 'test2', 'extraProp': '1'},
        {
          'type': 'object',
          'properties': {
            'name': {'type': 'string'},
            'nested': {'type': 'string'}
          },
          'additionalProperties': {'type': 'number'}
        }
      ).should.not.be.empty;
    });
  });
});
