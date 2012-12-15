'use strict';

var fs = require('fs');
var glob = require('glob');
var async = require('async');
var mocha = require('mocha');
var should = require('should');

var Validator = require('./lib/validator');

/**
 * Runs the JSON Schema Test Suite
 */
glob("test/suite/tests/draft3/**/*.json", {}, function (error, files) {
  if (error) {
    console.log(error);
  }

  async.forEach(files, function(file, next) {

    var suites = JSON.parse(fs.readFileSync(file));
    suites.forEach(function(suite) {
      console.log("\nSuite:", suite.description, file);
      suite.tests.forEach(function(test) {

        var validator = new Validator();
        var result = validator.validate(test.data, suite.schema);

        console.log("   Test:", test.description, "-->", (test.valid == (result.length === 0)) ? "pass" : '\u001b[31mfail\u001b[0m');

      });

    });
    next();

  }, function(error) {

  });
});
