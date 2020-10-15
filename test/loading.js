'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var Validator = require('../lib/index.js').Validator;
var assert = require('assert');

require('chai').should();

var dataSchema =           require('./fixtures/data_schema.json');
var dataCollectionSchema = require('./fixtures/data_collection_schema.json');
var typesSchema =          require('./fixtures/types.json');
var dataCollection =       require('./fixtures/data_collection.json');

describe('Schema management', function testSchemaManagement() {
  beforeEach(function () {
    this.validator = new Validator();
  });

  describe('when adding more than one schema', function testAddingTwoSchemas() {
    it('the first shouldn\'t be removed if referenced by the second', function testForDestructiveRefs() {
      this.validator.addSchema(dataSchema, '/data_schema.json');
      this.validator.addSchema(dataCollectionSchema, '/data_collection_schema.json');
      this.validator.schemas.should.not.have.property('/data_schema.json', null);
    });

    it('a schema shouldn\'t be added to unresolved refs if it exists', function checkUnresolvedRefs() {
      this.validator.addSchema(dataSchema, '/data_schema.json');
      this.validator.addSchema(dataCollectionSchema, '/data_collection_schema.json');
      this.validator.unresolvedRefs.indexOf('/data_schema.json').should.equal(-1);
    });

    it('the second schema should be able to use a reference to the first', function testForCorrectValidation() {
      this.validator.addSchema(dataSchema, '/data_schema.json');
      this.validator.addSchema(dataCollectionSchema, '/data_collection_schema.json');
      this.validator.addSchema(typesSchema, '/types.json');
      this.validator.validate(dataCollection, { $ref: '/data_collection_schema.json' }).valid.should.be.true;
    });

    it('Multiple schemas with the same id should throw an error', function testForCorrectValidation() {
      var validator = this.validator;
      assert.throws(function(){
        validator.addSchema({
          properties: {
            a: { id: 'http://example.com/schema.json', type: 'string' },
            b: { $id: 'http://example.com/schema.json', type: 'number' },
          },
        });
      }, function(err){
        // This may be changed as necessary
        err.message.should.equal('Schema <http://example.com/schema.json#> already exists with different definition');
        return true;
      })
    });
  });
});
