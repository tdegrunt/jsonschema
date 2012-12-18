'use strict';

var helpers = require('./helpers');

var attribute = {};

attribute.ignoreProperties = {
  // informativeProperties
  'id': true,
  'default': true,
  'description': true,
  'title': true,
  // argumentProperties
  'exclusiveMinimum': true,
  'exclusiveMaximum': true,
  'items': true,
  'additionalItems': true,
  'properties': true,
  'additionalProperties': true,
  'patternProperties': true,
  'extends': true
};

/**
 * @name validators
 */
var validators = attribute.validators = {};

/**
 * Tests whether the instance if of a certain type.
 * @private
 * @param instance
 * @param options
 * @param propertyName
 * @param type
 * @return {boolean}
 */
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
  // TODO: fix this - see #15
  case 'object':
    return (instance && (typeof instance) === 'object' && !(instance instanceof Array) && !(instance instanceof Date));
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

/**
 * Validates whether the instance if of a certain type
 * @param instance
 * @param schema
 * @param options
 * @param propertyName
 * @return {String|null}
 */
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

/**
 * Validates minimum and exclusiveMinimum when the type of the instance value is a number.
 * @param instance
 * @param schema
 * @return {String|null}
 */
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

/**
 * Validates maximum and exclusiveMaximum when the type of the instance value is a number.
 * @param instance
 * @param schema
 * @return {String|null}
 */
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

/**
 * Validates divisibleBy when the type of the instance value is a number.
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.divisibleBy = function validateDivisibleBy(instance, schema) {
  if (typeof instance !== 'number') {
    return null;
  }

  if (schema.divisibleBy == 0) {
    return "divisibleBy can't be zero";
  }

  if (instance / schema.divisibleBy % 1) {
    return "is not " + schema.divisibleBy;
  }
  return null;
};

/**
 * Validates whether the instance value is present.
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.required = function validateRequired(instance, schema) {
  if (instance === undefined && schema.required === true) {
    return "is required";
  }
  return null;
};

/**
 * Validates whether the instance value matches the regular expression, when the instance value is a string.
 * @param instance
 * @param schema
 * @return {*}
 */
validators.pattern = function validatePattern(instance, schema) {
  if (typeof instance !== 'string') {
    return null;
  }
  if (!instance.match(schema.pattern)) {
    return "does not match pattern" + schema.pattern;
  }
  return null;
};

/**
 * Validates whether the instance value is of a certain defined format, when the instance value is a string.
 * The following format are supported:
 *   - date-time
 *   - date
 *   - time
 *   - ip-address
 *   - ipv6
 *   - uri
 *   - color
 *   - host-name
 *   - alpha
 *   - alpha-numeric
 *   - utc-millisec
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.format = function validateFormat(instance, schema) {
  if (instance === undefined) {
    return null;
  }
  if (!helpers.isFormat(instance, schema.format)) {
    return "\"" + instance + "\" does not conform to format " + schema.format;
  }
  return null;
};

/**
 * Validates whether the instance value is at least of a certain length, when the instance value is a string.
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.minLength = function validateMinLength(instance, schema) {
  if (!(typeof instance === 'string')) {
    return null;
  }
  if (!(instance.length >= schema.minLength)) {
    return "does not meet minimum length of " + schema.minLength;
  }
  return null;
};

/**
 * Validates whether the instance value is at most of a certain length, when the instance value is a string.
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.maxLength = function validateMaxLength(instance, schema) {
  if (!(typeof instance === 'string')) {
    return null;
  }
  if (!(instance.length <= schema.maxLength)) {
    return "does not meet maximum length of " + schema.maxLength;
  }
  return null;
};

/**
 * Validates whether instance contains at least a minimum number of items, when the instance is an Array.
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.minItems = function validateMinItems(instance, schema) {
  if (!(instance instanceof Array)) {
    return null;
  }
  if (!(instance.length >= schema.minItems)) {
    return "does not meet minimum length of " + schema.minItems;
  }
  return null;
};

/**
 * Validates whether instance contains no more than a maximum number of items, when the instance is an Array.
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.maxItems = function validateMaxItems(instance, schema) {
  if (!(instance instanceof Array)) {
    return null;
  }
  if (!(instance.length <= schema.maxItems)) {
    return "does not meet maximum length of " + schema.maxItems;
  }
  return null;
};

/**
 * Deep compares arrays for duplicates
 * @param v
 * @param i
 * @param a
 * @private
 * @return {boolean}
 */
function testArrays(v, i, a) {
  var j, len = a.length;
  for (j = i + 1, len; j < len; j++) {
    if (helpers.deepCompareStrict(v, a[j])) {
      return false;
    }
  }
  return true;
}

/**
 * Validates whether there are no duplicates, when the instance is an Array.
 * @param instance
 * @return {String|null}
 */
validators.uniqueItems = function validateUniqueItems(instance) {
  if (!(instance instanceof Array)) {
    return null;
  }

  if (!instance.every(testArrays)) {
    return "contains duplicate item";
  }
  return null;
};

/**
 * Validate for the presence of dependency properties, if the instance is an object.
 * @param instance
 * @param schema
 * @param options
 * @param propertyName
 * @return {String|null}
 */
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
        var i, len = dep.length;
        for (i = 0, len; i < len; i++) {
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

/**
 * Validates whether the instance value is one of the enumerated values.
 *
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.enum = function validateEnum(instance, schema) {
  if (!(schema.enum instanceof Array)) {
    return "enum expects an array";
  }
  if (!schema.enum.some(helpers.deepCompareStrict.bind(null, instance))) {
    return "is not one of enum values: " + schema.enum;
  }
  return null;
};

/**
 * Validates whether the instance if of a prohibited type.
 * @param instance
 * @param schema
 * @param options
 * @param propertyName
 * @return {String|null}
 */
validators.disallow = function validateDisallow(instance, schema, options, propertyName) {
  var types = (schema.disallow instanceof Array) ? schema.disallow : [schema.disallow];
  if (types.some(testType.bind(this, instance, options, propertyName))) {
    return "is of prohibited type " + schema.type;
  }
  return null;
};


module.exports = attribute;
