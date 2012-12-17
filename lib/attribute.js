'use strict';

var helpers = require('./helpers');
var ValidatorResult = helpers.ValidatorResult;

var attribute = {};

attribute.informativeProperties = ['id', 'default', 'description', 'title'];
attribute.argumentProperties = ['exclusiveMinimum', 'exclusiveMaximum', 'additionalItems'];
attribute.ignoreProperties = [].concat(attribute.informativeProperties, attribute.argumentProperties);

var validators = attribute.validators = {};

function testType(instance, options, propertyName, type){
  switch (type) {
  case 'string': return (typeof instance=='string');
  case 'number': return (typeof instance=='number');
  case 'integer': return (typeof instance=='number') && instance%1===0;
  case 'boolean': return (typeof instance=='boolean');
  case 'object':
    return (instance && (typeof instance)=='object' && Object.getPrototypeOf(instance)===Object.prototype);
  case 'array': return (instance instanceof Array);
  case 'null': return (instance===null);
  case 'date': return (instance instanceof Date);
  case 'any': return true;
  }
  if(type && typeof type=='object'){
    var res = this.validateSchema(instance, type, options, propertyName);
    return res===undefined || !(res&&res.errors.length);
  }
}

validators.type = function validateType(instance, schema, options, propertyName) {
  var types = (schema.type instanceof Array)?schema.type:[schema.type];
  // Ignore undefined instances
  if (instance===undefined) return;
  if(!types.some(testType.bind(this, instance, options, propertyName))) {
    return "is not " + schema.type;
  }
};

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

// Only applicable for numbers
validators.minimum = function validateMinimum(instance, schema) {
  if (typeof instance!='number') return;
  var valid = true;
  if (schema.exclusiveMinimum && schema.exclusiveMinimum === true) {
    valid = instance > schema.minimum;
  } else {
    valid = instance >= schema.minimum;
  }
  if (!valid) {
    return "is not " + schema.minimum;
  }
};

// Only applicable for numbers
validators.maximum = function validateMaximum(instance, schema) {
  if (typeof instance!='number') return;
  var valid;
  if (schema.exclusiveMaximum && schema.exclusiveMaximum === true) {
    valid = instance < schema.maximum;
  } else {
    valid = instance <= schema.maximum;
  }
  if (!valid) {
    return "is not " + schema.maximum;
  }
};

// Only applicable for numbers
validators.divisibleBy = function validateDivisibleBy(instance, schema) {
  if (typeof instance!='number') return;
  if (instance % schema.divisibleBy) {
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
  if (typeof instance!='string') return;
  if(!instance.match(schema.pattern)) {
    return "does not match pattern" + schema.pattern;
  }
};

// Only applicable for strings, ignored otherwise
validators.format = function validateFormat(instance, schema, options, propertyName) {
  if(instance===undefined) return;
  if (!helpers.isFormat(instance, schema.format)) {
    return "does not conform to the '" + schema.format+"' format";
  }
};

// Only applicable for strings, ignored otherwise
validators.minLength = function validateMinLength(instance, schema) {
  if (!(typeof instance=='string')) return;
  if(!(instance.length >= schema.minLength)){
    return "does not meet minimum length of " + schema.minLength;
  }
};

// Only applicable for strings, ignored otherwise
validators.maxLength = function validateMaxLength(instance, schema) {
  if (!(typeof instance=='string')) return;
  if(!(instance.length <= schema.maxLength)){
    return "does not meet maximum length of " + schema.maxLength;
  }
};

// Only applicable for arrays, ignored otherwise
validators.minItems = function validateMinItems(instance, schema) {
  if (!(instance instanceof Array)) return;
  if(!(instance.length >= schema.minItems)){
    return "does not meet minimum length of " + schema.minItems;
  }
};

// Only applicable for arrays, ignored otherwise
validators.maxItems = function validateMaxItems(instance, schema) {
  if (!(instance instanceof Array)) return;
  if(!(instance.length <= schema.maxItems)){
    return "does not meet maximum length of " + schema.maxItems;
  }
};

// Only applicable for arrays, ignored otherwise
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

validators.enum = function validateEnum(instance, schema) {
  if (!(schema.enum instanceof Array)) {
    return "enum expects an array";
  }
  if(!schema.enum.some(helpers.deepCompareStrict.bind(null, instance))){
    return "is not one of enum values: " + schema.enum;
  }
};

validators.disallow = function validateDisallow(instance, schema, options, propertyName) {
  var types = (schema.disallow instanceof Array)?schema.disallow:[schema.disallow];
  if (types.some(testType.bind(this, instance, options, propertyName))) {
    return "is of prohibited type " + schema.type;
  }
};

module.exports = attribute;
