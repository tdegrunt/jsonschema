'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var Validator = require('../lib/validator');
var should = require('chai').should();

describe('Cross-Context', function () {
  describe('cross-context schema', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });
    it('local-oneOf-schema should validate a simple-value', function () {
      this.validator.validate(true, localSchema());
    });
    it('context-oneOf-schema should validate a simple-value', function() {
      this.validator.validate(true, contextSchema());
    });
  });
});

function localSchema() {
    return {
        oneOf: [
            { type:'string' },
            { type: 'boolean' }
        ]
    };
}
function contextSchema() {
    var vm = require('vm');
    return vm.runInNewContext([ '(', ')'].join(JSON.stringify(localSchema())));
}
