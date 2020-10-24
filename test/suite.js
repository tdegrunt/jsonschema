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
  require('json-metaschema/draft-06-schema.json'),
  require('json-metaschema/draft-06-hyper-schema.json'),
  require('json-metaschema/draft-07-schema.json'),
  require('json-metaschema/draft-07-hyper-schema.json'),
];

var root = __dirname+'/suite/tests/';
var paths = [
  'draft3', 'draft3/optional',
  'draft4', 'draft4/optional',
  'draft6', 'draft6/optional',
  'draft7', 'draft7/optional',
];
var ignoredFiles = ['optional', 'format', 'zeroTerminatedFloats.json', 'refRemote.json', 'ecmascript-regex.json', 'content.json', 'bignum.json', 'jsregex.json'];
var ignoredTests = [
  // TODO fix these tests for the next major release
  'additionalItems should not look in applicators/items defined in extends are not examined',
  'additionalProperties should not look in applicators/properties defined in extends are not examined',
];
var suiteFiles = [];
paths.forEach(function(path){
  fs.readdirSync(root+path).filter(function(file){
    if (ignoredFiles.indexOf(file) >= 0) return false;
    return true;
  }).forEach(function(file){
    suiteFiles.push(path + '/' + file);
  });
});
suiteFiles.push('draft7/optional/format/uri-reference.json');

/**
 * Runs the JSON Schema Test Suite
 */
describe('JSON Schema Test Suite', function(){
  suiteFiles.forEach(function(filepath) {
    var suites = JSON.parse(fs.readFileSync(root+filepath));
    suites.forEach(function(suite) {

      describe(filepath + ' ' + suite.description, function() {

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
