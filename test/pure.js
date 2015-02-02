'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var Validator = require('../lib/validator');
var should = require('chai').should();

describe('API', function () {
  describe('arguments are pure', function () {
    // Pure meaning they aren't modified by the function call
    beforeEach(function () {
      this.validator = new Validator();
    });

    it('"dependencies" constraint', function () {
      var data = {
        "foo": [1,2,3],
        "bar": 2
      };
      var schema = {
        "dependencies": {
          "bar": {
            "properties": {
              "foo": {
                "type": "array",
                "items": {"type":"integer"}
              },
              "bar": {"type": "integer"}
            },
            "required": ["foo", "bar"]
          }
        }
      };
      Object.freeze(data.foo);
      Object.freeze(data);
      this.validator.validate(data, schema);
    });
  });
});
