'use strict';

var helpers = require('./helpers');
var equal = require('deep-equal');

var attribute = {};

attribute.informativeProperties = ['id', 'default', 'description', 'title'];
attribute.argumentProperties = ['exclusiveMinimum', 'exclusiveMaximum'];
attribute.ignoreProperties = [].concat(attribute.informativeProperties, attribute.argumentProperties);

var validators = attribute.validators = {};

validators.type = function validateType(instance, schema) {
  var valid = false;
  switch (schema.type) {
  case 'string':
    valid = (typeof instance=='string');
    break;
  case 'number':
    valid = (typeof instance=='number');
    break;
  case 'integer':
    valid = (typeof instance=='number') && instance%1===0;
    break;
  case 'boolean':
    valid = (typeof instance=='boolean');
    break;
  case 'null':
    valid = (instance===null);
    break;
  case 'date':
    valid = (instance instanceof Date);
    break;
  case 'any':
    valid = true;
    break;
  }
  // Ignore undefined instances
  if (instance!==undefined && !valid) {
    return "is not " + schema.type;
  }
};

// Only applicable for numbers
validators.minimum = function validateMinimum(instance, schema) {
  var valid = true;

  if (typeof instance=='number') {
    if (schema.exclusiveMinimum && schema.exclusiveMinimum === true) {
      valid = instance > schema.minimum;
    } else {
      valid = instance >= schema.minimum;
    }
  }
  if (!valid) {
    return "is not " + schema.minimum;
  }
};

// Only applicable for numbers
validators.maximum = function validateMaximum(instance, schema) {
  var valid = true;

  if (typeof instance=='number') {
    if (schema.exclusiveMaximum && schema.exclusiveMaximum === true) {
      valid = instance < schema.maximum;
    } else {
      valid = instance <= schema.maximum;
    }
  }
  if (!valid) {
    return "is not " + schema.maximum;
  }
};

validators.required = function validateRequired(instance, schema) {
  if (instance===undefined && schema.required===true) {
    return "is required";
  }
};

// Only applicable for strings, ignored otherwise
validators.pattern = function validatePattern(instance, schema) {
  var valid = true;
  if (typeof instance=='string') {
    valid = (instance.match(schema.pattern) !== null);
  }
  if (!valid) {
    return "does not match pattern" + schema.pattern;
  }
};

// Only applicable for strings, ignored otherwise
validators.format = function validateFormat(instance, schema) {
  var valid = instance===undefined || ((typeof instance=='string') && helpers.isFormat(instance, schema.format));
  if (!valid) {
    return "\"" + instance + "\" does not conform to format " + schema.format;
  }
};

// Only applicable for strings, ignored otherwise
validators.minLength = function validateMinLength(instance, schema) {
  var valid = true;
  if (typeof instance=='string') {
    valid = instance.length >= schema.minLength;
  }
  if (!valid) {
    return "does not meet minimum length of " + schema.minLength;
  }
};

// Only applicable for strings, ignored otherwise
validators.maxLength = function validateMaxLength(instance, schema) {
  var valid = true;
  if (typeof instance=='string') {
    valid = instance.length <= schema.maxLength;
  }
  if (!valid) {
    return "does not meet maximum length of " + schema.maxLength;
  }
};

// Only applicable for arrays, ignored otherwise
validators.minItems = function validateMinItems(instance, schema) {
  var valid = true;
  if (instance instanceof Array) {
    valid = instance.length >= schema.minItems;
  }
  if (!valid) {
    return "does not meet minimum length of " + schema.minItems;
  }
};

// Only applicable for arrays, ignored otherwise
validators.maxItems = function validateMaxItems(instance, schema) {
  var valid = true;
  if (instance instanceof Array) {
    valid = instance.length <= schema.maxItems;
  }
  if (!valid) {
    return "does not meet maximum length of " + schema.maxItems;
  }
};

validators.enum = function validateEnum(instance, schema) {
  var valid = false;
  if (schema.enum instanceof Array) {
    for (var i=0; i<=schema.enum.length; i++) {
      valid = equal(instance, schema.enum[i]);
      // stop as soon as something is valid
      if (valid) {
        break;
      }
    }
    if (!valid) {
      return "is not one of enum values: " + schema.enum;
    }
  } else {
    return "enum expects an array";
  }
};


module.exports = attribute;
