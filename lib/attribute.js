'use strict';

var helpers = require('./helpers');

var Attribute = function Attribute(validator, name, schema, instance, propertyName) {
  this.validator = validator;
  this.name = name;
  this.schema = schema;
  this.value = schema[name];
  this.propertyName = propertyName;
  this.instance = instance;

  return this;
};

Attribute.prototype.createError = function (message) {
  return helpers.createError(this.name, this.propertyName, message);
};

// Ignored attributes, mostly due to that they are handled differently.
var IGNORED_ATTRIBUTES = [
  "exclusiveMinimum", "exclusiveMaximum"
];

Attribute.prototype.validate = function () {
  if (IGNORED_ATTRIBUTES.indexOf(this.name) !== -1) {
    return null;
  }
  var mName = 'validate' + helpers.capitalize(this.name);
  if (this[mName]) {
    return this[mName]();
  } else {
    console.log("WARNING: unsupported attribute:", this.name);
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
    return this.createError("is not " + this.value);
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
    return this.createError("is not " + this.value);
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
    return this.createError("is not " + this.value);
  }
};

Attribute.prototype.validateRequired = function () {
  var valid = true;

  if (!helpers.isDefined(this.instance) && this.value === true) {
    return this.createError("is required");
  }
};

// Only applicable for numbers
Attribute.prototype.validate$ref = function () {
  var valid = true;
  if (this.value && this.validator.schemas[this.value]) {
    this.validator.validateSchema(this.instance, this.validator.schemas[this.value]);
  } else {
    return this.createError("no such schema" + this.value);
  }
};

// Only applicable for strings, ignored otherwise
Attribute.prototype.validatePattern = function () {
  var valid = true;
  if (helpers.isString(this.instance)) {
    valid = (this.instance.match(this.value) !== null);
  }
  if (!valid) {
    return this.createError("does not match pattern" + this.value);
  }
};

// Only applicable for strings, ignored otherwise
Attribute.prototype.validateFormat = function () {
  var valid = true;
  valid = (helpers.isString(this.instance) && helpers.isFormat(this.instance, this.value));
  if (!valid) {
    return this.createError("does not conform to format" + this.value);
  }
};

module.exports = Attribute;