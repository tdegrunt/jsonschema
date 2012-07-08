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
  if (typeof schema.type === 'object' && (schema.type instanceof Array)) {
    this.validateUnionType(instance, schema);
  } else {
    this.validateSchema(instance, schema);
  }
  return this.errors.length === 0;
};

Validator.prototype.validateSchema = function (instance, schema, options) {
  var basicTypes = ['string', 'number', 'integer', 'boolean', 'null', 'date', 'any'];

  if (schema.type) {
    if (basicTypes.indexOf(schema.type) >= 0) {
      return this.validateProperty(instance, schema, options);
    }
    if (schema.type === 'object') {
      return this.validateObject(instance, schema);
    }
    if (schema.type === 'array') {
      return this.validateArray(instance, schema);
    }
  }
  if (schema.$ref) {
    return this.validateProperty(instance, schema);
  }
};

Validator.prototype.validateProperty = function (instance, schema, options) {
  var a;
  var valid = null;
  if (!options) {
    options = {addError: true};
  }
  for (var key in schema) {
    if (schema.hasOwnProperty(key)) {
      a = new Attribute(this, key, schema[key], instance);
      valid = a.validate();

      if (options.addError === true) {
        this.addError(valid);
      }
    }
  }
  return (valid === undefined);
};

Validator.prototype.validateObject = function (instance, schema) {
  var a;
  if (typeof instance !== 'object') {
    this.addError("not an object");
  } else {
    for (var property in schema.properties) {
      if (schema.properties.hasOwnProperty(property)) {
        this.validate(instance[property], schema.properties[property]);
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
      this.validate(instance[i], schema.items);
    }
  }
};

Validator.prototype.validateUnionType = function (instance, schema) {
  var i;
  var valid = false;
  for (i = 0; i < schema.type.length; i++) {
    if (typeof schema.type[i] === 'string') {
      valid = this.validateSchema7(instance, {'type': schema.type[i]}, {'addError': false});
    } else {
      valid = this.validateSchema(instance, schema.type[i], {'addError': false});
    }
    if (valid) {
      break;
    }
  }
  if (!valid) {
    this.addError("not any of " + schema.type.join(','));
  }
};

module.exports = Validator;