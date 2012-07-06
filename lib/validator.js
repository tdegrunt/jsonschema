'use strict';

var Attribute = require('./attribute');

var Validator = function Validator() {
  this.schemas = {};
  this.errors = [];
  return this;
};

Validator.prototype.addSchema = function (schema, urn) {
  this.schemas[urn] = schema;
};

Validator.prototype.addError = function (error) {
  if (error) {
    this.errors.push(error);
  }
};


Validator.prototype.validate = function (instance, schema) {
  if (typeof schema.type === 'string') {
    this.validateSchema(instance, schema);
  } else {
    this.validateUnionType(instance, schema);
  }
  return this.errors.length === 0;
};

Validator.prototype.validateSchema = function (instance, schema) {
  var basicTypes = ['string', 'number', 'integer', 'boolean', 'null', 'date', 'any'];
  var complexTypes = ['object', 'array'];

  if (basicTypes.indexOf(schema.type) >= 0) {
    this.validateProperty(instance, schema);
  }
};

Validator.prototype.validateProperty = function (instance, schema) {
  var a;
  for (var key in schema) {
    if (schema.hasOwnProperty(key)) {
      a = new Attribute(key, schema[key], instance);
      this.addError(a.validate());
    }
  }
};

module.exports = Validator;