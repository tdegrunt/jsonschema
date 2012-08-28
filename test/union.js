'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var mocha = require('mocha');
var Validator = require('../lib/validator');
var should = require('should');

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

    this.validator.addSchema(testSchema, 'Test#Simple');
    this.validator.addSchema(numSchema, 'Test#Num');
    this.validator.addSchema(objectIdSchema, 'MongoDb#ObjectId');

  });

  describe('string and number', function () {
    it('should validate for number', function () {
      this.validator.validate(1, {'type': ['number', 'string']}).should.be.empty;
    });
    it('should validate for string', function () {
      this.validator.validate('1', {'type': ['number', 'string']}).should.be.empty;
    });

    it('should not validate if no string or number', function () {
      this.validator.validate(true, {'type': ['number', 'string']}).should.not.be.empty;
    });
  });

  describe('string and null', function () {
    it('should validate for null', function () {
      this.validator.validate(null, {'type': ['null', 'string']}).should.be.empty;
      });
    it('should validate for string', function () {
      this.validator.validate('1', {'type': ['null', 'string']}).should.be.empty;
      });

    it('should not validate if no string or number', function () {
      this.validator.validate(true, {'type': ['null', 'string']}).should.not.be.empty;
    });
  });

  describe('string and null', function () {
    it('should validate for null', function () {
      this.validator.validate(null, {'type': ['null', 'string']}).should.be.empty;
      });
    it('should validate for string', function () {
      this.validator.validate('1', {'type': ['null', 'string']}).should.be.empty;
      });

    it('should not validate if no string or number', function () {
      this.validator.validate(true, {'type': ['null', 'string']}).should.not.be.empty;
      });
  });

  describe('null and $ref', function () {
    it('should validate for null', function () {
      this.validator.validate(null, {'type': ['null', {'$ref':'Test#Simple'}]}).should.be.empty;
    });

    it('should validate for string', function () {
      this.validator.validate('test', {'type': ['null', {'$ref':'Test#Simple'}]}).should.be.empty;
    });

    it('should not validate if no string or number', function () {
      this.validator.validate(true, {'type': ['null', {'$ref':'Test#Simple'}]}).should.not.be.empty;
     });
  });

  describe('$ref and string', function () {
    it('should validate for *', function () {
      this.validator.validate('*', {'type': [{ type: 'string', pattern: '^\\*$' }, {'$ref':'Test#Num'}]}).should.be.empty;
    });

    it('should validate for 1', function () {
      this.validator.validate(1, {'type': [{ type: 'string', pattern: '^\\*$' }, {'$ref':'Test#Num'}]}).should.be.empty;
    });

    it('should not validate for -', function () {
      var result = this.validator.validate('-', {'type': [{ type: 'string', pattern: '^\\*$' }, {'$ref':'Test#Num'}]});
      result.should.not.be.empty;
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
      var validator = new Validator();
      validator.validate({'wildcards': ['*']}, schema).should.be.empty;
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
      var validator = new Validator();
      validator.validate({'wildcards': []}, schema).should.be.empty;
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
      var validator = new Validator();
      validator.validate({'wildcards': [{"id": "1234", "_bsontype": "test"}, '*']}, schema).should.be.empty;
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
      var validator = new Validator();
      validator.validate({'wildcards': [{"id": "1234", "_bsontype": "test"}, '*']}, schema).should.be.empty;
    });

  });
});