'use strict';

var util = require('util');
var fs = require('fs');
var should = require('chai').should();

var Validator = require('./../lib/validator');

var paths = ['test/suite/tests/draft3', 'test/suite/tests/draft3/optional', 'test/suite/tests/draft4', 'test/suite/tests/draft4/optional'];
var ignoredFiles = ['optional', 'zeroTerminatedFloats.json', 'refRemote.json'];

/**
 * Runs the JSON Schema Test Suite
 */
describe('JSON Schema Test Suite', function(){

  paths.forEach(function(path) {
    fs.readdirSync(path).forEach(function(file) {
      if (~ignoredFiles.indexOf(file)) return;

        var suites = JSON.parse(fs.readFileSync(path+"/"+file));
        suites.forEach(function(suite) {

          describe(suite.description, function() {

            suite.tests.forEach(function(test) {

              it(test.description, function() {
                var validator = new Validator();
                validator.addSchema(require('./fixtures/draft-03.json', 'http://json-schema.org/draft-03/schema#'));
                validator.addSchema(require('./fixtures/draft-04.json', 'http://json-schema.org/draft-04/schema#'));
                var result = validator.validate(test.data, suite.schema);
                return should.equal(test.valid, result.valid, util.inspect(result, true, null));
              });

            });
          });

        });

    });
  });

});
