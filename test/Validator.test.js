'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var Validator = require('../lib/index.js').Validator;
var SchemaError = require('../lib/index.js').SchemaError;
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
      validator.addSchema({
        id: 'http://example.com/base.json',
      });
      assert.deepStrictEqual(validator.unresolvedRefs, []);
    });
    it('addSchema(schema) with absolute $id', function(){
      validator.addSchema({
        $id: 'http://example.com/base.json',
      });
      assert.deepStrictEqual(validator.unresolvedRefs, []);
    });
    it('addSchema(schema, base) with relative id', function(){
      validator.addSchema({id: 'base.json'}, 'http://example.com/index.html');
      assert('http://example.com/base.json' in validator.schemas);
    });
    it('addSchema(schema, base) with relative $id', function(){
      validator.addSchema({$id: 'base.json'}, 'http://example.com/index.html');
      assert('http://example.com/base.json' in validator.schemas);
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
  });
});
