'use strict';

var attribute = require('./attribute');
var helpers = require('./helpers');

var Validator = function Validator() {
  this.schemas = {};
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

Validator.prototype.validate = function validate(instance, schema, options, propertyName) {
  if(!propertyName) propertyName = 'instance';
  if (schema) {
    return this.validateSchema(instance, schema, options, propertyName);
  }
  throw new Error('no schema specified');
};

Validator.prototype.validateSchema = function validateSchema(instance, schema, options, propertyName) {
  if(!schema){
    return [helpers.createError(schema, undefined, undefined, "is undefined")];
  }
  var switchSchema = (typeof schema=='string')?schema:schema.$ref;
  if(switchSchema) {
    if (this.schemas[switchSchema]) {
      return this.validateSchema(instance, this.schemas[switchSchema], options, propertyName);
    } else {
      return [helpers.createError(schema, '$ref', propertyName, "no such schema " + switchSchema)];
    }
  }
  var errs = this.validateProperty(instance, schema, options, propertyName);
  if(instance instanceof Array){
    return errs.concat(this.validateArray(instance, schema, options, propertyName));
  }else if(instance && (typeof instance)=='object' && Object.getPrototypeOf(instance)===Object.prototype){
    return errs.concat(this.validateObject(instance, schema, options, propertyName));
  }else{
    return errs;
  }
};

// Validates each schema property against the instance
Validator.prototype.validateProperty = function validateProperty(instance, schema, options, propertyName) {
  var self=this;
  var errors = [];
  var skipAttributes = options&&options.skipAttributes || [];
  var keys = Object.keys(schema);
  keys.forEach(function(key){
    if (skipAttributes.indexOf(key)<0 && attribute.ignoreProperties.indexOf(key)<0) {
      var validatorErr;
      var validator = attribute.validators[key];
      if (validator) {
        validatorErr = validator.call(self, instance, schema, options, propertyName);
      } else {
        throw new Error("Unsupported attribute: "+key);
        validatorErr = "WARNING: unsupported attribute: "+key;
      }

      if (validatorErr) {
        errors.push(helpers.createError(schema, key, propertyName, validatorErr));
      }
    }
  });
  return errors;
};

Validator.prototype.validateObject = function (instance, schema, options, propertyName) {
  var errors = [];
  // Only validate undefined's if they are required
  if (instance===undefined) {
    if (schema && schema.required===true) {
      errors.push(helpers.createError(schema, undefined, propertyName, "is required", instance));
    }
    return errors;
  }
  if (typeof instance!=='object' || instance&&Object.getPrototypeOf(instance)!==Object.prototype) {
    errors.push(helpers.createError(schema, undefined, undefined, "not an object", instance));
  } else {
    var properties = schema.properties || {};
    var errs = this.validateAdditionalProperties(instance, schema, options, propertyName);
    if(errs&&errs.length) errors=errors.concat(errs);
    for(var property in properties){
      var prop = (instance||undefined) && instance[property];
      var errs = this.validate(prop, properties[property], options, propertyName+helpers.makeSuffix(property));
      if(errs&&errs.length) errors=errors.concat(errs);
    }
  }
  return errors;
};

Validator.prototype.validateAdditionalProperties = function (instance, schema, options, propertyName) {
  // true is the same as the default, an empty schema, which needs no validation
  if (schema.additionalProperties===undefined || schema.additionalProperties===true) {
    return [];
  }
  var errors = [];
  for(var property in instance){
    if (schema.properties[property]!==undefined) continue;
    if (schema.additionalProperties === false) {
      errors.push("Property " + property + " does not exist in the schema");
    } else {
      var errs = this.validateSchema(instance[property], schema.additionalProperties, options, propertyName+helpers.makeSuffix(property));
      if(errs&&errs.length) errors=errors.concat(errs);
    }
  }
  return errors;
};

// FIXME: This will fail if the schema doesn't have 'items' defined
Validator.prototype.validateArray = function (instance, schema, options, propertyName) {
  var self=this;
  if (instance===undefined || !schema.items) return [];
  var errors = [];
  instance.forEach(function(value, i){
    var errs = self.validateSchema(value, schema.items, options, propertyName+"["+i+"]");
    if(errs&&errs.length) errors=errors.concat(errs);
  });
  return errors;
};

module.exports = Validator;
