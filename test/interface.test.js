'use strict';

var lib = require('../lib/index.js');

var assert = require('assert');

describe('public interface', function(){
  it('Validator', function(){
    assert.strictEqual(typeof lib.Validator, 'function');
  });

  it('ValidatorResult', function(){
    assert.strictEqual(typeof lib.ValidatorResult, 'function');
  });

  it('ValidationError', function(){
    assert.strictEqual(typeof lib.ValidationError, 'function');
  });

  it('SchemaError', function(){
    assert.strictEqual(typeof lib.SchemaError, 'function');
  });

  it('SchemaScanResult', function(){
    assert.strictEqual(typeof lib.SchemaScanResult, 'function');
  });

  it('scan', function(){
    assert.strictEqual(typeof lib.scan, 'function');
  });

  it('validate', function(){
    assert.strictEqual(typeof lib.validate, 'function');
  });
});
