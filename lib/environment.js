'use strict';

/** @type Validator */
var Validator = require('./validator');

/**
 * Validation Environment
 * @name Environment
 * @constructor
 */
var Environment = function Environment() {
  this.schemas = {};
  return this;
};

/**
 * Adds a schema to the environment
 * @param schema
 * @param urn
 * @return {Object}
 */
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

/**
 * Validates instance against the provided schema
 * @param instance
 * @param schema
 * @return {Array}
 */
Environment.prototype.validate = function (instance, schema) {
  var v = new Validator();
  v.setSchemas(this.schemas);
  return v.validate(instance, schema);
};

module.exports = Environment;
