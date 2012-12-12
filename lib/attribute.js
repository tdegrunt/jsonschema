'use strict';

var helpers = require('./helpers');

var attribute = {};

attribute.informativeProperties = ['id', 'default', 'description', 'title'];
attribute.argumentProperties = ['exclusiveMinimum', 'exclusiveMaximum', 'items', 'additionalItems', 'properties', 'additionalProperties', 'patternProperties'];
attribute.ignoreProperties = [].concat(attribute.informativeProperties, attribute.argumentProperties);

var validators = attribute.validators = {};


var testType = function (instance, options, propertyName, type) {
  switch (type) {
  case 'string':
    return (typeof instance === 'string');
  case 'number':
    return (typeof instance === 'number');
  case 'integer':
    return (typeof instance === 'number') && instance % 1 === 0;
  case 'boolean':
    return (typeof instance === 'boolean');
  case 'object':
    return (instance && (typeof instance) === 'object');
  case 'array':
    return (instance instanceof Array);
  case 'null':
    return (instance === null);
  case 'date':
    return (instance instanceof Date);
  case 'any':
    return true;
  }
  if (type && typeof type === 'object') {
    var errs = this.validateSchema(instance, type, options, propertyName);
    return !(errs && errs.length);
  }

  return false;
};

validators.type = function validateType(instance, schema, options, propertyName) {
  // Ignore undefined instances
  if (instance === undefined) {
    return null;
  }
  var types = (schema.type instanceof Array) ? schema.type : [schema.type];
  if (!types.some(testType.bind(this, instance, options, propertyName))) {
    return "is not " + schema.type;
  }
  return null;
};

// Only applicable for numbers
validators.minimum = function validateMinimum(instance, schema) {
  if (typeof instance !== 'number') {
    return null;
  }
  var valid = true;
  if (schema.exclusiveMinimum && schema.exclusiveMinimum === true) {
    valid = instance > schema.minimum;
  } else {
    valid = instance >= schema.minimum;
  }
  if (!valid) {
    return "is not " + schema.minimum;
  }
  return null;
};

// Only applicable for numbers
validators.maximum = function validateMaximum(instance, schema) {
  if (typeof instance !== 'number') {
    return null;
  }
  var valid;
  if (schema.exclusiveMaximum && schema.exclusiveMaximum === true) {
    valid = instance < schema.maximum;
  } else {
    valid = instance <= schema.maximum;
  }
  if (!valid) {
    return "is not " + schema.maximum;
  }
  return null;
};

// Only applicable for numbers
validators.divisibleBy = function validateDivisibleBy(instance, schema) {
  if (typeof instance !== 'number') {
    return null;
  }
  if (instance % schema.divisibleBy) {
    return "is not " + schema.maximum;
  }
  return null;
};

validators.required = function validateRequired(instance, schema) {
  if (instance === undefined && schema.required === true) {
    return "is required";
  }
  return null;
};

// Only applicable for strings, ignored otherwise
validators.pattern = function validatePattern(instance, schema) {
  if (typeof instance !== 'string') {
    return null;
  }
  if (!instance.match(schema.pattern)) {
    return "does not match pattern" + schema.pattern;
  }
  return null;
};

// Only applicable for strings, ignored otherwise
validators.format = function validateFormat(instance, schema) {
  if (instance === undefined) {
    return null;
  }
  if (!helpers.isFormat(instance, schema.format)) {
    return "\"" + instance + "\" does not conform to format " + schema.format;
  }
  return null;
};

// Only applicable for strings, ignored otherwise
validators.minLength = function validateMinLength(instance, schema) {
  if (!(typeof instance === 'string')) {
    return null;
  }
  if (!(instance.length >= schema.minLength)) {
    return "does not meet minimum length of " + schema.minLength;
  }
  return null;
};

// Only applicable for strings, ignored otherwise
validators.maxLength = function validateMaxLength(instance, schema) {
  if (!(typeof instance === 'string')) {
    return null;
  }
  if (!(instance.length <= schema.maxLength)) {
    return "does not meet maximum length of " + schema.maxLength;
  }
  return null;
};

// Only applicable for arrays, ignored otherwise
validators.minItems = function validateMinItems(instance, schema) {
  if (!(instance instanceof Array)) {
    return null;
  }
  if (!(instance.length >= schema.minItems)) {
    return "does not meet minimum length of " + schema.minItems;
  }
  return null;
};

// Only applicable for arrays, ignored otherwise
validators.maxItems = function validateMaxItems(instance, schema) {
  if (!(instance instanceof Array)) {
    return null;
  }
  if (!(instance.length <= schema.maxItems)) {
    return "does not meet maximum length of " + schema.maxItems;
  }
  return null;
};

// @private
function testArrays(v, i, a) {
  var j, len;
  for (j = i + 1, len = a.length; j < len; j++) {
    if (helpers.deepCompareStrict(v, a[j])) {
      return false;
    }
  }
  return true;
}

// Only applicable for arrays, ignored otherwise
validators.uniqueItems = function validateUniqueItems(instance, schema) {
  if (!(instance instanceof Array)) {
    return null;
  }

  if (!instance.every(testArrays)) {
    return "contains duplicate item";
  }
  return null;
};

validators.dependencies = function validateDependencies(instance, schema, options, propertyName) {
  if (!instance || typeof instance !== 'object') {
    return null;
  }
  var property;
  for (property in schema.dependencies) {
    if (schema.dependencies.hasOwnProperty(property)) {
      if (instance[property] === undefined) {
        continue;
      }
      var dep = schema.dependencies[property];
      var propPath = propertyName + helpers.makeSuffix(property);
      if (typeof dep === 'string') {
        dep = [dep];
      }
      if (dep instanceof Array) {
        var i, len;
        for (i = 0, len = dep.length; i < len; i++) {
          if (instance[dep[i]] === undefined) {
            return " property " + dep[i] + " not found, required by " + propPath;
          }
        }
      } else {
        var errs = this.validateSchema(instance, dep, options, propPath);
        if (errs && errs.length) {
          return "does not meet dependency required by " + propPath;
        }
      }
    }
  }
  return null;
};


validators.enum = function validateEnum(instance, schema) {
  if (!(schema.enum instanceof Array)) {
    return "enum expects an array";
  }
  if (!schema.enum.some(helpers.deepCompareStrict.bind(null, instance))) {
    return "is not one of enum values: " + schema.enum;
  }
  return null;
};

validators.disallow = function validateDisallow(instance, schema, options, propertyName) {
  var types = (schema.disallow instanceof Array) ? schema.disallow : [schema.disallow];
  if (types.some(testType.bind(this, instance, options, propertyName))) {
    return "is of prohibited type " + schema.type;
  }
  return null;
};


module.exports = attribute;
