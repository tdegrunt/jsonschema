'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var Validator = require('../lib/validator');
var should = require('chai').should();

describe('Union', function () {
  beforeEach(function () {
    this.validator = new Validator();
    var testSchema = {
      "type" : "string",
    };

    var numSchema = {
      "type" : "number",
    };

    var objectIdSchema = {
      "type": "object",
      "id": "MongoDb#ObjectId",
      "description": "MongoDB ObjectID",
      "properties": {
        "id": {"type": "string"},
        "_bsontype": {"type": "string"}
      }
    };

    this.validator.addSchema(testSchema, '/Test#Simple');
    this.validator.addSchema(numSchema, '/Test#Num');
    this.validator.addSchema(objectIdSchema, '/MongoDb#ObjectId');

  });

  describe('string and number', function () {
    it('should validate for number', function () {
      this.validator.validate(1, {'type': ['number', 'string']}).valid.should.be.true;
    });
    it('should validate for string', function () {
      this.validator.validate('1', {'type': ['number', 'string']}).valid.should.be.true;
    });

    it('should not validate if no string or number', function () {
      this.validator.validate(true, {'type': ['number', 'string']}).valid.should.be.false;
    });
  });

  describe('string and null', function () {
    it('should validate for null', function () {
      this.validator.validate(null, {'type': ['null', 'string']}).valid.should.be.true;
    });
    it('should validate for string', function () {
      this.validator.validate('1', {'type': ['null', 'string']}).valid.should.be.true;
    });

    it('should not validate if no string or number', function () {
      this.validator.validate(true, {'type': ['null', 'string']}).valid.should.be.false;
    });
  });

  describe('string and null', function () {
    it('should validate for null', function () {
      this.validator.validate(null, {'type': ['null', 'string']}).valid.should.be.true;
    });
    it('should validate for string', function () {
      this.validator.validate('1', {'type': ['null', 'string']}).valid.should.be.true;
    });

    it('should not validate if no string or number', function () {
      this.validator.validate(true, {'type': ['null', 'string']}).valid.should.be.false;
    });
  });

  describe('null and $ref', function () {
    it('should validate for null', function () {
      this.validator.validate(null, {'type': ['null', {'$ref':'Test#Simple'}]}).valid.should.be.true;
    });

    it('should validate for string', function () {
      this.validator.validate('test', {'type': ['null', {'$ref':'Test#Simple'}]}).valid.should.be.true;
    });

    it('should not validate if no string or number', function () {
      this.validator.validate(true, {'type': ['null', {'$ref':'Test#Simple'}]}).valid.should.be.false;
    });
  });

  describe('$ref and string', function () {
    it('should validate for *', function () {
      this.validator.validate('*', {'type': [{ type: 'string', pattern: '^\\*$' }, {'$ref':'Test#Num'}]}).valid.should.be.true;
    });

    it('should validate for 1', function () {
      this.validator.validate(1, {'type': [{ type: 'string', pattern: '^\\*$' }, {'$ref':'Test#Num'}]}).valid.should.be.true;
    });

    it('should not validate for -', function () {
      var result = this.validator.validate('-', {'type': [{ type: 'string', pattern: '^\\*$' }, {'$ref':'Test#Num'}]});
      result.valid.should.be.false;
    });
  });

  describe('complex $ref and string', function () {
    it('should validate for array or *', function () {
      var schema = {
        "type": "object",
        "properties": {
          "wildcards": {
            "type": "array",
            "items": {"type": [{"$ref": "MongoDb#ObjectId"}, {"type": "string", "pattern": "^\\*$"}]}
          }
        }
      };
      this.validator.validate({'wildcards': ['*']}, schema).valid.should.be.true;
    });

    it('should validate for empty array', function () {
      var schema = {
        "type": "object",
        "properties": {
          "wildcards": {
            "type": "array",
            "items": {"type": [{"$ref": "MongoDb#ObjectId"}, {"type": "string", "pattern": "^\\*$"}]}
          }
        }
      };
      this.validator.validate({'wildcards': []}, schema).valid.should.be.true;
    });

    it('should validate for objectid', function () {
      var schema = {
        "type": "object",
        "properties": {
          "wildcards": {
            "type": "array",
            "items": {"type": [{"$ref": "MongoDb#ObjectId"}, {"type": "string", "pattern": "^\\*$"}]}
          }
        }
      };
      this.validator.validate({'wildcards': [{"id": "1234", "_bsontype": "test"}, '*']}, schema).valid.should.be.true;
    });

    it('should validate for objectid and ignore title and description', function () {
      var schema = {
        "type": "object",
        "properties": {
          "wildcards": {
            "type": "array",
            "items": {"type": [{"$ref": "MongoDb#ObjectId", "title": "test", "description": "test"}, {"type": "string", "pattern": "^\\*$"}]}
          }
        }
      };
      this.validator.validate({'wildcards': [{"id": "1234", "_bsontype": "test"}, '*']}, schema).valid.should.be.true;
    });

  });

  describe('union type in nested object array', function () {
    var schema = {
      type: 'object',
      required: true,
      properties: {
        frames: {
          type: 'array',
          required: true,
          items: {
            type: 'object',
            properties: {
              filename: {type: 'string', required: true},
              lineno: {type: ['integer', 'null']},
              method: {type: ['string', 'null']}
            }
          }
        },
        exception: {
          type: 'object',
          required: true,
          properties: {
            class: {type: 'string', required: true},
            message: {type: 'string'}
          }
        }
      }
    };
    var exc = {class: 'testing...', message: 'this is only a test'};
    it('should validate for nulls', function () {
      var instance = {frames: [{filename: 'somefile.js', lineno: null}], exception: exc};
      this.validator.validate(instance, schema).valid.should.be.true;
    });
    it('should validate for null and string', function () {
      var instance = {frames: [{filename: 'somefile.js', lineno: null}], exception: exc};
      this.validator.validate(instance, schema).valid.should.be.true;
    });
    it('should not validate for string and string', function () {
      var instance = {frames: [{filename: 'somefile.js', lineno: {hello: 'world'}}], exception: exc};
      this.validator.validate(instance, schema).valid.should.be.false;
    });
  });
});
