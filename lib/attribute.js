'use strict';

var helpers = require('./helpers');
var equal = require('deep-equal');

var Attribute = function Attribute(validator, name, schema, instance, propertyName, options) {
  this.validator = validator;
  this.name = name;
  this.schema = schema;
  this.value = schema[name];
  this.propertyName = propertyName;
  this.instance = instance;
  this.options = options;

  return this;
};

Attribute.prototype.createError = function (message) {
  return helpers.createError(this.schema, this.name, this.propertyName, message);
};

Attribute.prototype.validate = function () {
  // Ignored attributes, mostly due to that they are handled differently.
  if (this.name === "exclusiveMinimum" || this.name === "exclusiveMaximum" || this.name === "default" || this.name === "description" || this.name === "title") {
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
    valid = (typeof this.instance=='string');
    break;
  case 'number':
    valid = (typeof this.instance=='number');
    break;
  case 'integer':
    valid = (typeof this.instance=='number') && this.instance%1===0;
    break;
  case 'boolean':
    valid = (typeof this.instance=='boolean');
    break;
  case 'null':
    valid = (this.instance===null);
    break;
  case 'date':
    valid = (this.instance instanceof Date);
    break;
  case 'any':
    valid = true;
    break;
  }
  // Ignore undefined instances
  if (this.instance!==undefined && !valid) {
    return this.createError("is not " + this.value);
  }
};

// Only applicable for numbers
Attribute.prototype.validateMinimum = function () {
  var valid = true;

  if (typeof this.instance=='number') {
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

  if (typeof this.instance=='number') {
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
  if (this.instance===undefined && this.value === true) {
    return this.createError("is required");
  }
};

// Only applicable for numbers
Attribute.prototype.validate$ref = function () {
  var valid = true;
  if (this.validator.schemas[this.value]) {
    return this.validator.validateSchema(this.instance, this.validator.schemas[this.value], this.options);
  } else {
    return this.createError("no such schema " + this.value);
  }
};

// Only applicable for strings, ignored otherwise
Attribute.prototype.validatePattern = function () {
  var valid = true;
  if (typeof this.instance=='string') {
    valid = (this.instance.match(this.value) !== null);
  }
  if (!valid) {
    return this.createError("does not match pattern" + this.value);
  }
};

// Only applicable for strings, ignored otherwise
Attribute.prototype.validateFormat = function () {
  var valid = this.instance===undefined || ((typeof this.instance=='string') && helpers.isFormat(this.instance, this.value));
  if (!valid) {
    return this.createError("\"" + this.instance + "\" does not conform to format " + this.value);
  }
};

// Only applicable for strings, ignored otherwise
Attribute.prototype.validateMinLength = function () {
  var valid = true;
  if (typeof this.instance=='string') {
    valid = this.instance.length >= this.value;
  }
  if (!valid) {
    return this.createError("does not meet minimum length of " + this.value);
  }
};

// Only applicable for strings, ignored otherwise
Attribute.prototype.validateMaxLength = function () {
  var valid = true;
  if (typeof this.instance=='string') {
    valid = this.instance.length <= this.value;
  }
  if (!valid) {
    return this.createError("does not meet maximum length of " + this.value);
  }
};

// Only applicable for arrays, ignored otherwise
Attribute.prototype.validateMinItems = function () {
  var valid = true;
  if (this.instance instanceof Array) {
    valid = this.instance.length >= this.value;
  }
  if (!valid) {
    return this.createError("does not meet minimum length of " + this.value);
  }
};

// Only applicable for arrays, ignored otherwise
Attribute.prototype.validateMaxItems = function () {
  var valid = true;
  if (this.instance instanceof Array) {
    valid = this.instance.length <= this.value;
  }
  if (!valid) {
    return this.createError("does not meet maximum length of " + this.value);
  }
};

Attribute.prototype.validateEnum = function () {
  var valid = false;
  var i;

  if (this.value instanceof Array) {
    for (i = 0; i <= this.value.length; i++) {
      valid = equal(this.instance, this.value[i]);
      // stop as soon as something is valid
      if (valid) {
        break;
      }
    }
    if (!valid) {
      return this.createError("is not one of enum values: " + this.value);
    }
  } else {
    return this.createError("enum expects an array");
  }
};


module.exports = Attribute;
