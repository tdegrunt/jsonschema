'use strict';

var Attribute = function Attribute(validator, name, value, instance) {
  this.validator = validator;
  this.name = name;
  this.value = value;
  this.instance = instance;

  return this;
};

Attribute.prototype.validate = function () {
  var mName = 'validate' + this.name.replace(/^(.)/, function (str, p1) {
    return p1.toUpperCase();
  });
  if (this[mName]) {
    return this[mName]();
  }
};

Attribute.prototype.validateType = function () {
  var valid = false;
  switch (this.value) {
  case 'string':
    valid = typeof this.instance === 'string';
    break;
  case 'number':
    valid = typeof this.instance === 'number';
    break;
  case 'integer':
    valid = typeof this.instance === 'number' && parseFloat(this.instance) == parseInt(this.instance, 10) && !isNaN(this.instance);
    break;
  case 'boolean':
    valid = this.instance === true || this.instance === false;
    break;
  case 'null':
    valid = this.instance === null;
    break;
  case 'date':
    valid = typeof this.instance === 'object' && this.instance instanceof Date;
    break;
  case 'any':
    valid = true;
    break;
  default:
    break;
  }
  // Ignore undefined instances
  if (this.instance !== undefined && !valid) {
    return "type is not " + this.value;
  }
};

// Only applicable for numbers
Attribute.prototype.validateMinimum = function () {
  var valid = true;

  if (typeof this.instance  === 'number') {
    valid = this.instance >= this.value;
  }
  if (!valid) {
    return "minumum";
  }
};

// Only applicable for numbers
Attribute.prototype.validateMaximum = function () {
  var valid = true;

  if (typeof this.instance  === 'number') {
    valid = this.instance <= this.value;
  }
  if (!valid) {
    return "maximum";
  }
};

Attribute.prototype.validateRequired = function () {
  var valid = true;

  if (this.instance  === undefined && this.value === true) {
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
  if (typeof this.instance  === 'string') {
    valid = (this.instance.match(this.value) !== null);
  }
  if (!valid) {
    return "pattern";
  }
};

module.exports = Attribute;