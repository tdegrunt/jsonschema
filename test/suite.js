'use strict';

var util = require('util');
var fs = require('fs');
var should = require('chai').should();

var Validator = require('../lib/index.js').Validator;
var schemas = [
  require('json-metaschema/draft-03-schema.json'),
  require('json-metaschema/draft-03-hyper-schema.json'),
  require('json-metaschema/draft-04-schema.json'),
  require('json-metaschema/draft-04-hyper-schema.json'),
//  require('json-metaschema/draft-07-schema.json'),
//  require('json-metaschema/draft-07-hyper-schema.json'),
];

var paths = ['test/suite/tests/draft3', 'test/suite/tests/draft3/optional', 'test/suite/tests/draft4', 'test/suite/tests/draft4/optional'];
var ignoredFiles = ['optional', 'format', 'zeroTerminatedFloats.json', 'refRemote.json', 'ecmascript-regex.json', 'content.json', 'bignum.json', 'jsregex.json'];
var ignoredTests = [
  // TODO fix these tests for the next major release
  'additionalItems should not look in applicators/items defined in extends are not examined',
  'additionalProperties should not look in applicators/properties defined in extends are not examined',
];

/**
 * Runs the JSON Schema Test Suite
 */
describe('JSON Schema Test Suite', function(){

  paths.forEach(function(path) {
    fs.readdirSync(path).forEach(function(file) {
      if (~ignoredFiles.indexOf(file)) return;

      var suites = JSON.parse(fs.readFileSync(path+"/"+file));
      suites.forEach(function(suite) {

        describe(path + '/' + file + ' ' + suite.description, function() {

          suite.tests.forEach(function(test) {

            it(test.description, function() {
              if(ignoredTests.indexOf(suite.description + '/' + test.description) >= 0) return void this.skip();
              var validator = new Validator();
              schemas.forEach(function(s){ validator.addSchema(s); });
              var result = validator.validate(test.data, suite.schema);
              return should.equal(test.valid, result.valid, util.inspect(result, true, null));
            });

          });
        });

      });

    });
  });

});
