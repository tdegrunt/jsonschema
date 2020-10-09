'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var Validator = require('../lib/index.js').Validator;
var SchemaError = require('../lib/index.js').SchemaError;
var assert = require('assert');

require('chai').should();

describe('Objects', function () {
  beforeEach(function () {
    this.validator = new Validator();
  });

  describe('simple object', function () {
    it('should validate a valid object', function () {
      this.validator.validate({}, {'type': 'object'}).valid.should.be.true;
    });

    it('should validate an undefined object', function () {
      this.validator.validate(undefined, {'type': 'object'}).valid.should.be.true;
    });

    it('should not validate a number', function () {
      return this.validator.validate(0, {'type': 'object'}).valid.should.be.false;
    });

    it('should not validate an array', function () {
      return this.validator.validate([0], {'type': 'object'}).valid.should.be.false;
    });
  });

  describe('object with property', function () {
    it('should validate a valid object', function () {
      this.validator.validate(
        {'name': 'test'},
        {
          'type': 'object',
          'properties': {
            'name': {'type': 'string'},
          },
        }
      ).valid.should.be.true;
    });

    it('should not validate an invalid object', function () {
      return this.validator.validate(0, {'type': 'object'}).valid.should.be.false;
    });
  });

  describe('object with enumerable properties in prototype chain', function () {
    var schema = {
      required: ['constructor'],
      properties: {
        constructor: { type: 'string' },
      },
    };
    it('should validate a valid property', function () {
      var res = this.validator.validate(Object.create({constructor: 'string'}), schema);
      assert.strictEqual(res.valid, true);
    });
    it('should not validate an invalid property', function () {
      var res = this.validator.validate(Object.create({constructor: true}), schema);
      assert.strictEqual(res.valid, false);
      res.errors[0].name.should.equal('type');
    });
    it('should not validate a missing property', function () {
      var res = this.validator.validate(Object.create({}), schema);
      assert.strictEqual(res.valid, false);
      res.errors[0].name.should.equal('required');
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
            'address': {'type': 'string'},
          },
        }
      ).valid.should.be.true;
    });

    it('should validate a valid object with undefined property', function () {
      this.validator.validate(
        {'name': 'test'},
        {
          'type': 'object',
          'properties': {
            'name': {'type': 'string'},
            'address': {'type': 'string'},
          },
        }
      ).valid.should.be.true;
    });

    it('should not throw when checking properties on a non-object', function() {
      this.validator.validate(
        null,
        {
          'type': 'object',
          'properties': {
            'name': {'type': 'string'},
          },
        }
      ).valid.should.be.false;
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
            'nested': {'type': 'object'},
          },
        }
      ).valid.should.be.false;
    });

    it('should validate a valid object', function () {
      this.validator.validate(
        {'name': 'test', 'nested': 'test2'},
        {
          'type': 'object',
          'properties': {
            'name': {'type': 'string'},
            'nested': {'type': 'string'},
          },
        }
      ).valid.should.be.true;
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
                'baz': {'type': 'number', 'required': true},
              },
            },
          },
        }
      ).valid.should.be.false;
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
            'nested': {'type': 'string'},
          },
          'additionalProperties': false,
        }
      ).valid.should.be.true;
    });

    it('should not validate if there are additionalProperties', function () {
      this.validator.validate(
        {'name': 'test', 'nested': 'test2', 'extraProp': 1},
        {
          'type': 'object',
          'properties': {
            'name': {'type': 'string'},
            'nested': {'type': 'string'},
          },
          'additionalProperties': false,
        }
      ).valid.should.be.false;
    });

    it('should validate if the additionalProperties are compliant with additionalProperties', function () {
      this.validator.validate(
        {'name': 'test', 'nested': 'test2', 'extraProp': 1},
        {
          'type': 'object',
          'properties': {
            'name': {'type': 'string'},
            'nested': {'type': 'string'},
          },
          'additionalProperties': {'type': 'number'},
        }
      ).valid.should.be.true;
    });

    it('should not validate if the additionalProperties are not compliant with additionalProperties', function () {
      this.validator.validate(
        {'name': 'test', 'nested': 'test2', 'extraProp': '1'},
        {
          'type': 'object',
          'properties': {
            'name': {'type': 'string'},
            'nested': {'type': 'string'},
          },
          'additionalProperties': {'type': 'number'},
        }
      ).valid.should.be.false;
    });

  });

  describe('properties', function () {
    it('should treat undefined property schema as not existing', function () {
      var schema = {
        'type': 'object',
        'properties': {
          'name': {'type': 'string'},
          'nested': undefined,
        },
        'additionalProperties': {'type': 'number'},
      };
      this.validator.validate(
        {'name': 'test', 'nested': 2},
        schema
      ).valid.should.be.true;
      this.validator.validate(
        {'name': 'test', 'nested': 'test2'},
        schema
      ).valid.should.be.false;
    });

    it('should not permit null as a schema', function () {
      var validator = this.validator;
      var schema = {
        'type': 'object',
        'properties': {
          'name': {'type': 'string'},
          'nested': null,
        },
        'additionalProperties': {'type': 'number'},
      };
      assert.throws(function(){
        validator.validate(
          {'name': 'test', 'nested': 2},
          schema
        );
      }, function(err){
        assert(err instanceof SchemaError);
        assert.strictEqual(err.message, 'Unexpected null, expected schema in "properties"');
        return true;
      });
    });
  });

  describe('patternProperties', function () {
    it('should treat undefined property schema as not existing', function () {
      var schema = {
        'type': 'object',
        'patternProperties': {
          'name': {'type': 'string'},
          'nested': undefined,
        },
        'additionalProperties': {'type': 'number'},
      };
      this.validator.validate(
        {'name': 'test', 'nested': 2},
        schema
      ).valid.should.be.true;
      this.validator.validate(
        {'name': 'test', 'nested': 'test2'},
        schema
      ).valid.should.be.false;
    });

    it('should not permit null as a schema', function () {
      var validator = this.validator;
      var schema = {
        'type': 'object',
        'patternProperties': {
          'name': {'type': 'string'},
          'nested': null,
        },
        'additionalProperties': {'type': 'number'},
      };
      assert.throws(function(){
        validator.validate(
          {'name': 'test', 'nested': 2},
          schema
        );
      }, function(err){
        assert(err instanceof SchemaError);
        assert.strictEqual(err.message, 'Unexpected null, expected schema in "patternProperties"');
        return true;
      });
    });
  });
});
