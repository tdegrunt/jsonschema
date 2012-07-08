'use strict';

var helpers = require('./helpers');

var Attribute = function Attribute(validator, name, schema, instance) {
  this.validator = validator;
  this.name = name;
  this.schema = schema;
  this.value = schema[name];
  this.instance = instance;

  return this;
};

Attribute.prototype.validate = function () {
  var mName = 'validate' + helpers.capitalize(this.name);
  if (this[mName]) {
    return this[mName]();
  }
};

Attribute.prototype.validateType = function () {
  var valid = false;
  switch (this.value) {
  case 'string':
    valid = helpers.isString(this.instance);
    break;
  case 'number':
    valid = helpers.isNumber(this.instance);
    break;
  case 'integer':
    valid = helpers.isInteger(this.instance);
    break;
  case 'boolean':
    valid = helpers.isBoolean(this.instance);
    break;
  case 'null':
    valid = helpers.isNull(this.instance);
    break;
  case 'date':
    valid = helpers.isDate(this.instance);
    break;
  case 'any':
    valid = true;
    break;
  default:
    break;
  }
  // Ignore undefined instances
  if (helpers.isDefined(this.instance) && !valid) {
    return "type is not " + this.value;
  }
};

// Only applicable for numbers
Attribute.prototype.validateMinimum = function () {
  var valid = true;

  if (helpers.isNumber(this.instance)) {
    if (this.schema.exclusiveMinimum && this.schema.exclusiveMinimum === true) {
      valid = this.instance > this.value;
    } else {
      valid = this.instance >= this.value;
    }
  }
  if (!valid) {
    return "minumum";
  }
};

// Only applicable for numbers
Attribute.prototype.validateMaximum = function () {
  var valid = true;

  if (helpers.isNumber(this.instance)) {
    if (this.schema.exclusiveMaximum && this.schema.exclusiveMaximum === true) {
      valid = this.instance < this.value;
    } else {
      valid = this.instance <= this.value;
    }
  }
  if (!valid) {
    return "maximum";
  }
};

Attribute.prototype.validateRequired = function () {
  var valid = true;

  if (!helpers.isDefined(this.instance) && this.value === true) {
    return "is required";
  }
};

// Only applicable for numbers
Attribute.prototype.validate$ref = function () {
  var valid = true;
  if (this.value && this.validator.schemas[this.value]) {
    this.validator.validateSchema(this.instance, this.validator.schemas[this.value]);
  } else {
    return "no such schema: " + this.value;
  }
};

// Only applicable for strings, ignored otherwise
Attribute.prototype.validatePattern = function () {
  var valid = true;
  if (helpers.isString(this.instance)) {
    valid = (this.instance.match(this.value) !== null);
  }
  if (!valid) {
    return "pattern";
  }
};

// Only applicable for strings, ignored otherwise
Attribute.prototype.validateFormat = function () {
  var valid = true;
  valid = (helpers.isString(this.instance) && helpers.isFormat(this.instance, this.value));
  if (!valid) {
    return "format";
  }
};

module.exports = Attribute;