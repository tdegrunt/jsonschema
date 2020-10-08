'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var Validator = require('../lib/index.js').Validator;

var metaschema = require('json-metaschema/draft-04-schema.json');

require('chai').should();

describe('Meta-schema', function () {

  beforeEach(function () {
    this.validator = new Validator();
  });

  it('validates itself', function () {
    metaschema.should.exist;
    this.validator.validate(metaschema, metaschema).valid.should.be.true;
  });

});
