'use strict';
var Validator = require('../lib/validator');
var assert = require('assert');

describe('$ref to a local fragment on a schema without $id (issue #423)', function () {
  it('resolves "#/definitions/X" without constructing a URL from an opaque base', function () {
    var schema = {
      $ref: '#/definitions/X',
      definitions: { X: { type: 'object' } },
    };
    var result = new Validator().validate({}, schema);
    assert.strictEqual(result.valid, true);
    var bad = new Validator().validate(1, schema);
    assert.strictEqual(bad.valid, false);
  });
  it('still reports an unknown document as SchemaError', function () {
    var schema = { $ref: 'missing.json#/definitions/X' };
    assert.throws(function () { new Validator().validate({}, schema); }, /no such schema/);
  });
});
