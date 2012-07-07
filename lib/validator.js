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

  if (basicTypes.indexOf(schema.type) >= 0) {
    this.validateProperty(instance, schema);
  }
  if (schema.type === 'object') {
    this.validateObject(instance, schema);
  }
  if (schema.type === 'array') {
    this.validateArray(instance, schema);
  }
  if (schema.$ref) {
    this.validateProperty(instance, schema);
  }
};

Validator.prototype.validateProperty = function (instance, schema) {
  var a;
  for (var key in schema) {
    if (schema.hasOwnProperty(key)) {
      a = new Attribute(this, key, schema[key], instance);
      this.addError(a.validate());
    }
  }
};

Validator.prototype.validateObject = function (instance, schema) {
  var a;
  if (typeof instance !== 'object') {
    this.addError("not an object");
  } else {
    for (var property in schema.properties) {
      if (schema.properties.hasOwnProperty(property)) {
        this.validateSchema(instance[property], schema.properties[property]);
      }
    }
  }
};

Validator.prototype.validateArray = function (instance, schema) {
  var a, i;
  if (!(instance instanceof Array)) {
    this.addError("not an array");
  } else {
    for (i = 0; i < instance.length; i++) {
      this.validateSchema(instance[i], schema.items);
    }
  }
};

Validator.prototype.validateUnionType = function (instance, schema) {
};

module.exports = Validator;