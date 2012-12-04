'use strict';

var helpers = require('./helpers');

var attribute = {};

attribute.informativeProperties = ['id', 'default', 'description', 'title'];
attribute.argumentProperties = ['exclusiveMinimum', 'exclusiveMaximum','items','properties','additionalProperties'];
attribute.ignoreProperties = [].concat(attribute.informativeProperties, attribute.argumentProperties);

var validators = attribute.validators = {};

validators.type = function validateType(instance, schema) {
  var types = (schema.type instanceof Array)?schema.type:[schema.type];
  var valid = types.some(function(type){
    switch (type) {
    case 'string': return (typeof instance=='string');
    case 'number': return (typeof instance=='number');
    case 'integer': return (typeof instance=='number') && instance%1===0;
    case 'boolean': return valid = (typeof instance=='boolean');
    case 'object':
      return (instance && (typeof instance)=='object' && Object.getPrototypeOf(instance)===Object.prototype);
      break;
    case 'array': return (instance instanceof Array);
    case 'null': return (instance===null);
    case 'date': return (instance instanceof Date);
    case 'any': return true;
    }
  });

  // Ignore undefined instances
  if (instance!==undefined && !valid) {
    return "is not " + schema.type;
  }
};

// Only applicable for numbers
validators.minimum = function validateMinimum(instance, schema) {
  if (!(typeof instance=='number')) return;
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
  if (!(typeof instance=='number')) return;
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
validators.uniqueItems = function validateUniqueItems(instance, schema) {
  if (!(instance instanceof Array)) return;
  function testArrays(v, i, a){
    for(var j=i+1; j<a.length; j++) if(helpers.deepCompareStrict(v,a[j])) return false;
    return true;
  };
  if(!instance.every(testArrays)){
    return "contains duplicate item";
  }
};

validators.enum = function validateEnum(instance, schema) {
  if (!(schema.enum instanceof Array)) {
    return "enum expects an array";
  }
  if(!schema.enum.some(helpers.deepCompareStrict.bind(null, instance))){
    return "is not one of enum values: " + schema.enum;
  }
};


module.exports = attribute;
