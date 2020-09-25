'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

require('chai').should();

var Validator = require('..').Validator;
var metaschema = require('json-metaschema/draft-04-schema.json');

describe('Meta-schema', function () {

  beforeEach(function () {
    this.validator = new Validator();
  });

  it('validates itself', function () {
    metaschema.should.exist;
    this.validator.validate(metaschema, metaschema).valid.should.be.true;
  });

});
