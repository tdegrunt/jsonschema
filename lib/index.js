'use strict';

var Validator = module.exports.Validator = require('./validator');

module.exports.Environment = require('./environment');

module.exports.validate = function (instance, schema) {
  var v = new Validator();
  return v.validate(instance, schema);
};