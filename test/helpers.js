'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var assert = require('assert');
var helpers = require('../lib/helpers.js');
var Validator = require('../lib/index.js').Validator;

describe('helpers', function () {
  describe('SchemaContext#makeChild', function () {
    it('resolves the child base against the parent when the child has an id', function () {
      var ctx = new helpers.SchemaContext({}, {}, [], 'http://example.com/foo.json', {});
      var childSchema = {$id: 'bar.json'};
      var child = ctx.makeChild(childSchema, 'bar');
      assert.strictEqual(child.base, 'http://example.com/bar.json');
      assert.strictEqual(child.schemas['http://example.com/bar.json'], childSchema);
    });

    it('strips a fragment from an id-less child base instead of leaving it untouched', function () {
      var ctx = new helpers.SchemaContext({}, {}, [], 'http://example.com/foo.json#/some/frag', {});
      var child = ctx.makeChild({type: 'string'}, 'prop');
      assert.strictEqual(child.base, 'http://example.com/foo.json');
    });

    it('leaves a fragment-free id-less child base unchanged', function () {
      var ctx = new helpers.SchemaContext({}, {}, [], 'http://example.com/foo.json', {});
      var child = ctx.makeChild({type: 'string'}, 'prop');
      assert.strictEqual(child.base, 'http://example.com/foo.json');
    });

    it('still resolves refs correctly when a subschema declares its own id', function () {
      var validator = new Validator();
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
  });

  describe('makeSuffix', function () {
    it('returns identical output for repeated calls with a dotted-form key', function () {
      assert.strictEqual(helpers.makeSuffix('foo'), '.foo');
      assert.strictEqual(helpers.makeSuffix('foo'), '.foo');
    });

    it('returns identical output for repeated calls with a numeric key', function () {
      assert.strictEqual(helpers.makeSuffix(3), '[3]');
      assert.strictEqual(helpers.makeSuffix(3), '[3]');
      assert.strictEqual(helpers.makeSuffix('42'), '[42]');
      assert.strictEqual(helpers.makeSuffix('42'), '[42]');
    });

    it('returns identical output for repeated calls with a key needing JSON.stringify quoting', function () {
      assert.strictEqual(helpers.makeSuffix('a.b'), '["a.b"]');
      assert.strictEqual(helpers.makeSuffix('a.b'), '["a.b"]');
      assert.strictEqual(helpers.makeSuffix('has space'), '["has space"]');
      assert.strictEqual(helpers.makeSuffix('has space'), '["has space"]');
    });
  });
});
