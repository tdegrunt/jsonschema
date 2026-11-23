'use strict';

var assert = require('assert');
var Validator = require('../lib/index.js').Validator;

describe('Rewriting alternatives', function () {
  function rewrite(value, schema) {
    return schema.format === 'custom' ? 'CUSTOM: ' + value : value;
  }

  ['anyOf', 'oneOf'].forEach(function (keyword) {
    var schema = {};
    schema[keyword] = [
      {type: 'number'},
      {type: 'string', format: 'custom'},
    ];

    it('returns a rewritten scalar from ' + keyword, function () {
      var result = new Validator().validate('text', schema, {rewrite: rewrite});
      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.instance, 'CUSTOM: text');
    });

    it('updates an object property through ' + keyword, function () {
      var input = {value: 'text'};
      var result = new Validator().validate(input, {
        type: 'object', properties: {value: schema},
      }, {rewrite: rewrite});
      assert.strictEqual(result.valid, true);
      assert.deepStrictEqual(input, {value: 'CUSTOM: text'});
    });

    it('updates an array item through ' + keyword, function () {
      var input = ['text'];
      var result = new Validator().validate(input, {
        type: 'array', items: schema,
      }, {rewrite: rewrite});
      assert.strictEqual(result.valid, true);
      assert.deepStrictEqual(input, ['CUSTOM: text']);
    });

    it('retains the original value when ' + keyword + ' has no match', function () {
      var alternatives = {};
      alternatives[keyword] = [{type: 'number', format: 'custom'}];
      var result = new Validator().validate('text', alternatives, {rewrite: rewrite});
      assert.strictEqual(result.valid, false);
      assert.strictEqual(result.instance, 'text');
    });

    it('preserves falsy rewritten values through ' + keyword, function () {
      [false, 0, '', null, undefined].forEach(function (replacement) {
        var result = new Validator().validate('text', schema, {
          rewrite: function (value, subschema) {
            return subschema.format === 'custom' ? replacement : value;
          },
        });
        assert.strictEqual(result.valid, true);
        assert.strictEqual(result.instance, replacement);
      });
    });
  });

  it('keeps the first matching anyOf rewrite', function () {
    var result = new Validator().validate('text', {
      anyOf: [{format: 'custom'}, {type: 'string'}],
    }, {rewrite: rewrite});
    assert.strictEqual(result.instance, 'CUSTOM: text');
  });

  it('does not rewrite an ambiguous oneOf result', function () {
    var result = new Validator().validate('text', {
      oneOf: [{format: 'custom'}, {type: 'string'}],
    }, {rewrite: rewrite});
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.instance, 'text');
  });

  it('applies the parent rewrite to the selected branch value', function () {
    var result = new Validator().validate('text', {
      oneOf: [{type: 'string', format: 'custom'}], format: 'custom',
    }, {rewrite: rewrite});
    assert.strictEqual(result.instance, 'CUSTOM: CUSTOM: text');
  });

  it('returns scalar root rewrites without changing the caller variable', function () {
    var input = 'text';
    var result = new Validator().validate(input, {
      type: 'string', format: 'custom',
    }, {rewrite: rewrite});
    assert.strictEqual(input, 'text');
    assert.strictEqual(result.instance, 'CUSTOM: text');
  });
});
