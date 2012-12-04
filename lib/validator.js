'use strict';

var attribute = require('./attribute');
var helpers = require('./helpers');

var Validator = function Validator() {
  this.schemas = {};
  this.errors = [];
  return this;
};

Validator.prototype.addSchema = function addSchema(schema, urn) {
  if (!schema) return;
  var ourUrn = urn||schema.id;
  if (ourUrn) this.schemas[ourUrn] = schema;
  return this.schemas[ourUrn];
};

Validator.prototype.setSchemas = function setSchemas(schemas) {
  this.schemas = schemas;
};

Validator.prototype.addError = function addError(error) {
  if (error) {
    this.errors.push(error);
  }
};

Validator.prototype.validate = function validate(instance, schema, options, propertyName) {
  if(!propertyName) propertyName = 'instance';
  if (schema) {
    if (schema.type instanceof Array) {
      this.validateUnionType(instance, schema, options, propertyName);
    } else {
      this.validateSchema(instance, schema, options, propertyName);
    }
  }
  return this.errors;
};

Validator.prototype.validateSchema = function validateSchema(instance, schema, options, propertyName) {
  if(typeof schema=='string'){
    schema = this.schemas[schema];
  }
  if(!schema){
    this.addError(helpers.createError(schema, undefined, undefined, "is undefined"));
    return;
  }
  this.validateProperty(instance, schema, options, propertyName);
  if (schema.type) {
    switch (schema.type) {
    case 'string':
    case 'number':
    case 'integer':
    case 'boolean':
    case 'null':
    case 'date':
    case 'any':
      return;
    case 'object':
      return this.validateObject(instance, schema, options, propertyName);
    case 'array':
      return this.validateArray(instance, schema, options, propertyName);
    }
  }
  if (schema.$ref) {
    return this.validateProperty(instance, schema, options, propertyName);
  }
};

// Validates each schema property against the instance
Validator.prototype.validateProperty = function validateProperty(instance, schema, options, propertyName) {
  var self=this;
  if(schema.$ref) {
    if (this.schemas[schema.$ref]) {
      this.validateSchema(instance, this.schemas[schema.$ref], options, propertyName);
    } else {
      self.addError(helpers.createError(schema, '$ref', propertyName, "no such schema " + schema.$ref));
    }
    return;
  }
  var skipAttributes = options&&options.skipAttributes || [];
  var keys = Object.keys(schema);
  keys.forEach(function(key){
    if (skipAttributes.indexOf(key)<0 && attribute.ignoreProperties.indexOf(key)<0) {
      var validatorErr;
      var validator = attribute.validators[key];
      if (validator) {
        validatorErr = validator(instance, schema);
      } else {
        validatorErr = "WARNING: unsupported attribute: "+key;
      }

      if (validatorErr) {
        self.addError(helpers.createError(schema, key, propertyName, validatorErr));
      }
    }
  });
};

Validator.prototype.validateObject = function (instance, schema, options, propertyName) {
  var self=this;
  // Only validate undefined's if they are required
  if (instance===undefined) {
    if (schema && schema.required===true) {
      this.addError(helpers.createError(schema, undefined, propertyName, "is required", instance));
    }
    return;
  }
  if (typeof instance!=='object' || instance&&Object.getPrototypeOf(instance)!==Object.prototype) {
    this.addError(helpers.createError(schema, undefined, undefined, "not an object", instance));
  } else {
    if (schema.properties) {
      this.validateAdditionalProperties(instance, schema, options, propertyName);
      var keys = Object.keys(schema.properties);
      keys.forEach(function(property){
        var prop = (instance||undefined) && instance[property];
        self.validate(prop, schema.properties[property], options, propertyName+helpers.makeSuffix(property));
      });
    }
  }
};

Validator.prototype.validateAdditionalProperties = function (instance, schema, options, propertyName) {
  // true is the same as the default, an empty schema, which needs no validation
  if (schema.additionalProperties===undefined || schema.additionalProperties===true) {
    return;
  }

  var self=this;
  var keys = Object.keys(instance);
  keys.forEach(function(property){
    if (schema.properties[property]===undefined) {
      if (schema.additionalProperties === false) {
        self.addError("Property " + property + " does not exist in the schema");
      } else {
        self.validate(instance[property], schema.additionalProperties, options, propertyName+helpers.makeSuffix(property));
      }
    }
  });
};

// FIXME: This will fail if the schema doesn't have 'items' defined
Validator.prototype.validateArray = function (instance, schema, options, propertyName) {
  var self=this;
  if (instance===undefined) return;
  if (!(instance instanceof Array)) {
    this.addError("not an array");
    return;
  }
  instance.forEach(function(value, i){
    self.validate(value, schema.items, options, propertyName+"["+i+"]");
  });
};

Validator.prototype.validateUnionType = function (instance, schema, options, propertyName) {
  var numErrors = this.errors.length;
  var startingNumErrors = numErrors;
  var valid = false;
  for (var i=0, len=schema.type.length; i<len; i++) {
    if (typeof schema.type[i] === 'string') {
      this.validateSchema(instance, {'type': schema.type[i]}, options, propertyName);
    } else {
      this.validateSchema(instance, schema.type[i], options, propertyName);
    }
    if (this.errors.length === numErrors) {
      valid = true;
      break;
    } else {
      numErrors = this.errors.length - startingNumErrors;
    }
  }

  if (valid) {
    this.errors = this.errors.slice(0, startingNumErrors);
  } else {
    this.addError("not any of union type");
  }
};

module.exports = Validator;
