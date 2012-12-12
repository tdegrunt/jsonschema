'use strict';

var Validator = require('./validator');

var Environment = function Environment() {
  this.schemas = {};
  return this;
};

Environment.prototype.addSchema = function (schema, urn) {
  var ourUrn = urn;

  if (!schema) {
    return null;
  }

  if (!urn) {
    ourUrn = schema.id;
  }
  if (ourUrn) {
    this.schemas[ourUrn] = schema;
  }
  return this.schemas[ourUrn];
};

Environment.prototype.validate = function (instance, schema) {
  var v = new Validator();
  v.setSchemas(this.schemas);
  return v.validate(instance, schema);
};

module.exports = Environment;