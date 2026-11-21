'use strict';

var Validator = require('../lib/index.js').Validator;
var assert = require('assert');

describe('Unknown schema attributes', function () {
  var validator;
  var options = {allowUnknownAttributes: false};

  beforeEach(function () {
    validator = new Validator();
  });

  it('allows definitions while validating referenced schemas', function () {
    var schema = {
      id: 'http://example.com/schema.json',
      type: 'array',
      items: {$ref: '#/definitions/item'},
      definitions: {item: {type: 'string'}},
    };
    assert.strictEqual(validator.validate(['hello'], schema, options).valid, true);
    assert.strictEqual(validator.validate([42], schema, options).valid, false);
  });

  it('allows definitions nested inside another schema', function () {
    var schema = {
      id: 'http://example.com/schema.json',
      type: 'object',
      properties: {
        value: {
          type: 'array',
          items: {$ref: '#/properties/value/definitions/item'},
          definitions: {item: {type: 'integer'}},
        },
      },
    };
    assert.strictEqual(validator.validate({value: [42]}, schema, options).valid, true);
    assert.strictEqual(validator.validate({value: ['hello']}, schema, options).valid, false);
  });

  it('does not apply unused definitions to the instance', function () {
    var schema = {type: 'string', definitions: {unused: {type: 'number'}}};
    assert.strictEqual(validator.validate('hello', schema, options).valid, true);
  });

  it('still rejects unknown attributes inside referenced schemas', function () {
    var schema = {
      id: 'http://example.com/schema.json',
      type: 'array',
      items: {$ref: '#/definitions/item'},
      definitions: {item: {unsupportedKeyword: true}},
    };
    assert.throws(function () {
      validator.validate(['hello'], schema, options);
    }, /Unsupported attribute: unsupportedKeyword/);
  });

  it('still rejects misspelled schema keywords', function () {
    assert.throws(function () {
      validator.validate('hello', {definitons: {}}, options);
    }, /Unsupported attribute: definitons/);
  });
});
