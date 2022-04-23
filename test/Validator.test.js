'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var Validator = require('../lib/index.js').Validator;
var SchemaError = require('../lib/index.js').SchemaError;
var ValidationError = require('../lib/index.js').ValidationError;
var ValidatorResult = require('../lib/index.js').ValidatorResult;
var ValidatorResultError = require('../lib/index.js').ValidatorResultError;
var assert = require('assert');

describe('Validator', function () {
  var validator;
  beforeEach(function () {
    validator = new Validator();
  });
  describe('Validator#unresolvedRefs', function(){
    it('initial value', function(){
      assert.deepStrictEqual(validator.unresolvedRefs, []);
    });
    it('addSchema', function(){
      validator.addSchema({
        id: 'http://example.com/base.json',
        items: {
          $ref: 'item.json',
        },
      });
      assert.deepStrictEqual(validator.unresolvedRefs, ['http://example.com/item.json']);
    });
  });
  describe('Validator#addSchema', function () {
    it('argument schema must be a schema: object', function(){
      validator.addSchema({}, 'http://example.com/base.json');
      assert.deepStrictEqual(validator.schemas['http://example.com/base.json'], {});
    });
    // TODO: held for major version upgrade
    it.skip('argument schema must be a schema: true', function(){
      validator.addSchema(true, 'http://example.com/base.json');
      assert.deepStrictEqual(validator.schemas['http://example.com/base.json'], true);
    });
    // TODO: held for major version upgrade
    it.skip('argument schema must be a schema: false', function(){
      validator.addSchema(false, 'http://example.com/base.json');
      assert.deepStrictEqual(validator.schemas['http://example.com/base.json'], false);
    });
    it('argument schema must be a schema: null', function(){
      var res = validator.addSchema(undefined, 'http://example.com/base.json');
      assert.strictEqual(res, null);
      assert(!('http://example.com/base.json' in validator.schemas));
    });
    it('argument schema must be a schema: undefined', function(){
      var res = validator.addSchema(undefined, 'http://example.com/base.json');
      assert.strictEqual(res, null);
      assert(!('http://example.com/base.json' in validator.schemas));
    });
    // TODO: held for major version upgrade
    it.skip('argument schema must not be a number', function(){
      assert.throws(function(){
        validator.addSchema(1, 'http://example.com/base.json');
      }, function(err){
        assert(err instanceof Error);
        return true;
      });
    });
    // TODO: held for major version upgrade
    it.skip('argument schema must not be a string', function(){
      assert.throws(function(){
        validator.addSchema("schema", 'http://example.com/base.json');
      }, function(err){
        assert(err instanceof Error);
        return true;
      });
    });
    // TODO: held for major version upgrade
    it.skip('argument schema must not be null', function(){
      assert.throws(function(){
        validator.addSchema(null, 'http://example.com/base.json');
      }, function(err){
        assert(err instanceof Error);
        return true;
      });
    });
    // TODO: held for major version upgrade
    it.skip('argument schema must not be undefined', function(){
      assert.throws(function(){
        validator.addSchema(undefined, 'http://example.com/base.json');
      }, function(err){
        assert(err instanceof Error);
        return true;
      });
    });
    it('addSchema(schema) with absolute id', function(){
      validator.addSchema({id: 'http://example.com/base.json'});
      assert.deepStrictEqual(validator.unresolvedRefs, []);
      assert.deepStrictEqual(validator.schemas['http://example.com/base.json'], {id: 'http://example.com/base.json'});
    });
    it('addSchema(schema) with absolute $id', function(){
      validator.addSchema({
        $id: 'http://example.com/base.json',
      });
      assert.deepStrictEqual(validator.unresolvedRefs, []);
    });
    // TODO: held for next major version
    it.skip('base must be a full URI', function(){
      assert.throws(function(){
        validator.addSchema({id: 'main.json'}, '/index.json');
      }, function(err){
        assert(err instanceof SchemaError);
        return true;
      });
    });
    it('addSchema(schema, base) with absolute base', function(){
      var res = validator.addSchema({type: 'string'}, 'http://example.com/main.json');
      assert(res);
      assert('http://example.com/main.json' in validator.schemas);
      assert.deepStrictEqual(validator.schemas['http://example.com/main.json'], res);
    });
    it('addSchema(schema, base) with absolute $id', function(){
      var res = validator.addSchema({type: 'string'}, 'http://example.com/main.json');
      assert(res);
      assert('http://example.com/main.json' in validator.schemas);
      assert.deepStrictEqual(validator.schemas['http://example.com/main.json'], res);
    });
    it('addSchema(schema, base) with relative id', function(){
      var res = validator.addSchema({id: 'main.json'}, 'http://example.com/index.html');
      // assert(res);
      assert('http://example.com/main.json' in validator.schemas);
    });
    it('addSchema(schema, base) with relative $id', function(){
      var res = validator.addSchema({$id: 'main.json'}, 'http://example.com/index.html');
      // assert(res);
      assert('http://example.com/main.json' in validator.schemas);
    });
    it('addSchema() populates unresolvedRefs', function(){
      validator.addSchema({
        $id: 'main.json',
        items: {
          $ref: 'item.json',
        },
      }, 'http://example.com/index.json');
      assert('http://example.com/main.json' in validator.schemas);
      assert.strictEqual(validator.unresolvedRefs[0], 'http://example.com/item.json');
      validator.addSchema({$id: 'item.json'}, 'http://example.com/index.json');
      assert.strictEqual(validator.unresolvedRefs.length, 0);
    });
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
        assert(err.message.indexOf('object or boolean') >= 0);
        return true;
      });
    });
    it('schema cannot be undefined', function () {
      assert.throws(function () {
        validator.validate(true, undefined);
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
    it('options may be undefined', function () {
      validator.validate(null, true, undefined);
    });
    it('options may be null', function () {
      validator.validate(null, true, null);
    });
    it('options.base must be a string', function () {
      validator.validate(null, true, null);
    });
    it('options.required with defined instance', function () {
      var res = validator.validate(undefined, true, {required: true});
      assert(!res.valid);
      assert(res.errors[0].message.indexOf('required') >= 0);
      var neg = validator.validate(null, true, {required: true});
      assert(neg.valid);
    });
    it('options.required with undefined instance', function () {
      var res = validator.validate(undefined, true, {required: true});
      assert(!res.valid);
      assert(res.errors[0].message.indexOf('required') >= 0);
      var neg = validator.validate(null, true, {required: true});
      assert(neg.valid);
    });
    it('options.required is false', function () {
      var res = validator.validate(undefined, true, {required: false});
      assert(res.valid);
      var neg = validator.validate(null, true, {required: true});
      assert(neg.valid);
    });
    it('options.required defaults false', function () {
      // TODO DEPRECATED: this behavior changes to true in next major version
      var res = validator.validate(undefined, true, {});
      assert(res.valid);
      var neg = validator.validate(null, true, {required: true});
      assert(neg.valid);
    });
    it('options.throwError', function () {
      var schema = {
        properties: {
          "a": {type: 'number'},
          "b": {type: 'number'},
        },
      };
      var valid = {a:0, b:0};
      var invalid = {a:null, b:null};
      var res = validator.validate(valid, schema, {});
      assert(res.valid);
      var neg = validator.validate(invalid, schema, {});
      assert(!neg.valid);
      assert.throws(function(){
        validator.validate(invalid, schema, {throwError: true});
      }, function(err){
        assert(err instanceof ValidationError);
        return true;
      });
    });
    it('options.throwFirst', function () {
      var schema = {
        properties: {
          "a": {type: 'number'},
          "b": {type: 'number'},
        },
      };
      var valid = {a:0, b:0};
      var invalid = {a:null, b:null};
      var res = validator.validate(valid, schema, {throwAll: true});
      assert(res.valid);
      var neg = validator.validate(invalid, schema, {});
      assert(!neg.valid);
      assert.throws(function(){
        validator.validate(invalid, schema, {throwFirst: true});
      }, function(err){
        assert(err instanceof Error);
        assert(err instanceof ValidatorResultError);
        assert.strictEqual(err.errors.length, 1);
        return true;
      });
    });
    it('options.throwAll', function () {
      var schema = {
        properties: {
          "a": {type: 'number'},
          "b": {type: 'number'},
        },
      };
      var valid = {a:0, b:0};
      var invalid = {a:null, b:null};
      var res = validator.validate(valid, schema, {throwAll: true});
      assert(res.valid);
      var neg = validator.validate(invalid, schema, {});
      assert(!neg.valid);
      assert.throws(function(){
        validator.validate(invalid, schema, {throwAll: true});
      }, function(err){
        assert(err instanceof Error);
        assert(err instanceof ValidatorResultError);
        assert.strictEqual(err.errors.length, 2);
        return true;
      });
    });
    it('million errors', function () {
      var schema = {
        type: 'number',
        oneMillionErrors: true,
      };
      validator.attributes.oneMillionErrors = function(instance, schema, options, ctx) {
        const result = new ValidatorResult(instance, schema, options, ctx);
        for(var i = 0; i < 1000000; i++) {
          result.addError('oneMillionErrors error');
        }
        return result;
      }
      var res = validator.validate(1, schema, {});
      assert(!res.valid);
      assert.strictEqual(res.errors.length, 1000000);
    });
    it('subschema references (named reference)', function () {
      var schema = {
        items: {$ref: '#items'},
        definitions: {
          items: {
            $id: '#items',
            type: 'array',
          },
        },
      };
      var res = validator.validate([[]], schema);
      assert(res.valid);
      var neg = validator.validate([null], schema);
      assert(!neg.valid);
    });
    it('subschema references (path reference)', function () {
      var schema = {
        items: {$ref: '#/definitions/items'},
        definitions: {
          items: {
            type: 'array',
          },
        },
      };
      var res = validator.validate([[]], schema);
      assert(res.valid);
      var neg = validator.validate([null], schema);
      assert(!neg.valid);
    });
    it('recursive references (fragment reference)', function () {
      var schema = {
        $id: 'http://example.com/foo.json',
        items: {$ref: '#'},
        type: 'array',
      };
      var res = validator.validate([[[[]]]], schema);
      assert(res.valid);
      var neg = validator.validate([null], schema);
      assert(!neg.valid);
    });
    it('recursive references (filename reference)', function () {
      var schema = {
        $id: 'http://example.com/foo.json',
        items: {$ref: 'foo.json'},
        type: 'array',
      };
      var res = validator.validate([[[[]]]], schema);
      assert(res.valid);
      var neg = validator.validate([null], schema);
      assert(!neg.valid);
    });
  });
});
