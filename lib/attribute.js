'use strict';

var helpers = require('./helpers');
var ValidatorResult = helpers.ValidatorResult;
var SchemaError = helpers.SchemaError;

var attribute = {};

attribute.ignoreProperties = {
  // informative properties
  'id': true,
  'default': true,
  'description': true,
  'title': true,
  // arguments to other properties
  'exclusiveMinimum': true,
  'exclusiveMaximum': true,
  'additionalItems': true,
  // special-handled properties
  '$schema': true,
  '$ref': true,
  'extends': true,
};

/**
 * @name validators
 */
var validators = attribute.validators = {};

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
  if (instance===undefined) return;
  var types = (schema.type instanceof Array) ? schema.type : [schema.type];
  if(!types.some(this.testType.bind(this, instance, schema, options, propertyName))) {
    return "is not of a type(s) " + types.map(function(v){ return v.id&&('<'+v.id+'>') || v.toString(); });
  }
  return null;
};

/**
 * Validates properties
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.properties = function validateProperties(instance, schema, options, propertyName) {
  var result = new ValidatorResult(instance, schema, options, propertyName);
  var properties = schema.properties || {};
  for(var property in properties){
    var prop = (instance||undefined) && instance[property];
    var res = this.validateSchema(prop, properties[property], options, propertyName+helpers.makeSuffix(property));
    instance[property] = res.instance;
    result.importErrors(res);
  }
  return result;
}

/**
 * Validates patternProperties
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.patternProperties = function validatePatternProperties(instance, schema, options, propertyName) {
  var result = new ValidatorResult(instance, schema, options, propertyName);
  var patternProperties = schema.patternProperties || {};

  for(var pattern in patternProperties){
    var expr = new RegExp(pattern);
    for(var property in instance){
      if(!expr.test(property)) continue;
      var errs = this.validateSchema(instance[property], patternProperties[pattern], options, propertyName+helpers.makeSuffix(property));
      result.importErrors(errs);
    }
  }

  return result;
}

/**
 * Validates additionalProperties
 * @param instance
 * @param schema
 * @param options
 * @param propertyName
 * @return {String|null}
 */
validators.additionalProperties = function validateAdditionalProperties(instance, schema, options, propertyName) {
  // true is the same as the default, an empty schema, which needs no validation
  if (schema.additionalProperties===true) return;
  var result = new ValidatorResult(instance, schema, options, propertyName);
  for(var property in instance){
    if (schema.properties[property]!==undefined) continue;
    if (schema.additionalProperties === false) {
      result.addError("Property " + property + " does not exist in the schema");
    } else {
      var res = this.validateSchema(instance[property], schema.additionalProperties, options, propertyName+helpers.makeSuffix(property));
      result.importErrors(res);
    }
  }
  return result;
}

/**
 * Validates items when instance is an array
 * @param instance
 * @param schema
 * @param options
 * @param propertyName
 * @return {String|null}
 */
validators.items = function validateItems(instance, schema, options, propertyName) {
  if (!(instance instanceof Array)) return;
  var self = this;
  var result = new ValidatorResult(instance, schema, options, propertyName);
  if (instance===undefined || !schema.items) return result;
  instance.every(function(value, i){
    var items = (schema.items instanceof Array)?(schema.items[i]||schema.additionalItems):schema.items;
    if(items===undefined) return true;
    if(items===false){
      result.addError("additionalItems not permitted");
      return false;
    }
    var res = self.validateSchema(value, items, options, propertyName+"["+i+"]");
    instance[i] = res.instance;
    result.importErrors(res);
    return true;
  });
  return result;
}

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
 * Of course, this is susceptable to floating point error since it compares the floating points
 * and not the JSON byte sequences to arbritrary precision.
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.divisibleBy = function validateDivisibleBy(instance, schema) {
  if (typeof instance !== 'number') {
    return null;
  }

  if (schema.divisibleBy == 0) {
    throw new SchemaError("divisibleBy cannot be zero");
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
 * @return {String|null}
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
 * @param options
 * @param propertyName
 * @return {String|null}
 */
validators.format = function validateFormat(instance, schema, options, propertyName) {
  if (instance === undefined) {
    return null;
  }
  if (!helpers.isFormat(instance, schema.format)) {
    return "does not conform to the '" + schema.format+"' format";
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
 * Validates that every item in an instance array is unique, when instance is an array
 * @param instance
 * @param schema
 * @param options
 * @param propertyName
 * @return {String|null}
 */
validators.uniqueItems = function validateUniqueItems(instance, schema, options, propertyName) {
  var result = new ValidatorResult(instance, schema, options, propertyName);
  if (!(instance instanceof Array)) return result;
  function testArrays(v, i, a){
    for(var j=i+1; j<a.length; j++) if(helpers.deepCompareStrict(v,a[j])) return false;
    return true;
  };
  if(!instance.every(testArrays)){
    result.addError("contains duplicate item");
  }
  return result;
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
  var result = new ValidatorResult(instance, schema, options, propertyName);
  if (!instance || typeof instance!='object') return;
  for(var property in schema.dependencies){
    if(instance[property]===undefined) continue;
    var dep = schema.dependencies[property];
    var propPath = propertyName+helpers.makeSuffix(property);
    if(typeof dep=='string'){
      dep=[dep];
    }
    if(dep instanceof Array){
      dep.forEach(function(prop){
        if(instance[prop] === undefined){
          result.addError("property "+prop+" not found, required by "+propPath);
        }
      });
    }else{
      var errs = this.validateSchema(instance, dep, options, propPath);
      if(errs&&errs.errors.length){
        result.addError("does not meet dependency required by "+propPath);
        result.importErrors(errs);
      }
    }
  }
  return result;
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
    throw new SchemaError("enum expects an array", schema);
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
  var self = this;
  var result = new ValidatorResult(instance, schema, options, propertyName);
  var types = (schema.disallow instanceof Array)?schema.disallow:[schema.disallow];
  types.forEach(function(type){
    if(self.testType(instance, schema, options, propertyName, type)){
      var schemaId = type&&type.id&&('<'+type.id+'>') || type.toString();
      result.addError("is of prohibited type " + schemaId);
    }
  });
  return result;
};

module.exports = attribute;
