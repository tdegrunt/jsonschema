'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var Validator = require('..').Validator;
var SchemaError = require('..').SchemaError;
var assert = require('assert');

describe('Validator', function () {
  var validator;
  beforeEach(function () {
    validator = new Validator();
  });
  describe('Validator#validate', function () {
    it('schema may be an object', function () {
      var res = validator.validate(true, {});
      assert(res.valid);
    });
    it('schema may be true', function () {
      var res = validator.validate(true, true);
      assert(res.valid);
    });
    it('schema may be false', function () {
      var res = validator.validate(true, false);
      assert(!res.valid);
    });
    it('schema cannot be null', function () {
      assert.throws(function () {
        validator.validate(true, null);
      }, function(err){
        assert(err instanceof SchemaError);
        return true;
      });
    });
    it('schema cannot be a string', function () {
      assert.throws(function () {
        validator.validate(true, "string");
      }, function(err){
        assert(err instanceof SchemaError);
        return true;
      });
    });
  });
});
