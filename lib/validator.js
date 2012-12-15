'use strict';

var attribute = require('./attribute');
var helpers = require('./helpers');
var ValidatorResult = helpers.ValidatorResult;
var ValidationError = helpers.ValidationError;

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
  if(!options) options = {};
  if(!propertyName) propertyName = options.propertyName||'instance';
  if (schema) {
    var result = this.validateSchema(instance, schema, options, propertyName);
    if(!result) throw new Error('Result undefined');
    return result.errors;
  }
  throw new Error('no schema specified');
};

Validator.prototype.validateSchema = function validateSchema(instance, schema, options, propertyName) {
  var result = new ValidatorResult(instance, schema, options, propertyName);
  if(!schema){
    throw new Error("schema is undefined");
  }
  var switchSchema = (typeof schema=='string')?schema:schema.$ref;
  if(switchSchema) {
    if (this.schemas[switchSchema]) {
      return this.validateSchema(instance, this.schemas[switchSchema], options, propertyName);
    } else {
      return "no such schema " + switchSchema;
    }
  }
  result.importErrors(this.validateProperty(instance, schema, options, propertyName));
  if(instance instanceof Array){
    result.importErrors(this.validateArray(instance, schema, options, propertyName));
  }else if(instance && (typeof instance)=='object' && Object.getPrototypeOf(instance)===Object.prototype){
    result.importErrors(this.validateObject(instance, schema, options, propertyName));
  }
  if(typeof options.rewrite=='function'){
    var value = options.rewrite.call(this, instance, schema, options, propertyName);
    result.instance = value;
  }
  return result;
};

// Validates each schema property against the instance
Validator.prototype.validateProperty = function validateProperty(instance, schema, options, propertyName) {
  var self=this;
  var result = new ValidatorResult(instance, schema, options, propertyName);
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
      }
      if (validatorErr) {
        result.importErrors(validatorErr);
      }
    }
  });
  return result;
};

Validator.prototype.validateObject = function (instance, schema, options, propertyName) {
  var result = new ValidatorResult(instance, schema, options, propertyName);
  // Only validate undefined's if they are required
  if (instance===undefined) {
    if (schema && schema.required===true) {
      result.addError(schema, undefined, propertyName, "is required", instance);
    }
    return result;
  }
  if (typeof instance!=='object' || instance&&Object.getPrototypeOf(instance)!==Object.prototype) {
    result.addError(schema, undefined, undefined, "not an object", instance);
    return result;
  }

  var properties = schema.properties || {};

  // true is the same as the default, an empty schema, which needs no validation
  if (schema.additionalProperties!==undefined && schema.additionalProperties!==true) {
    for(var property in instance){
      if (properties[property]!==undefined) continue;
      if (schema.additionalProperties === false) {
        result.addError(schema, undefined, undefined, "Property " + property + " does not exist in the schema");
      } else {
        var res = this.validateSchema(instance[property], schema.additionalProperties, options, propertyName+helpers.makeSuffix(property));
        result.importErrors(res);
      }
    }
  }

  var patternProperties = schema.patternProperties || {};
  for(var pattern in patternProperties){
    var expr = new RegExp(pattern);
    for(var property in instance){
      if(!expr.test(property)) continue;
      var errs = this.validateSchema(instance[property], patternProperties[pattern], options, propertyName+helpers.makeSuffix(property));
      result.importErrors(errs);
    }
  }

  for(var property in properties){
    var prop = (instance||undefined) && instance[property];
    var res = this.validateSchema(prop, properties[property], options, propertyName+helpers.makeSuffix(property));
    instance[property] = res.instance;
    result.importErrors(res);
  }
  return result;
};

Validator.prototype.validateArray = function (instance, schema, options, propertyName) {
  var self=this;
  var result = new ValidatorResult(instance, schema, options, propertyName);
  if (instance===undefined || !schema.items) return result;
  instance.every(function(value, i){
    var items = (schema.items instanceof Array)?(schema.items[i]||schema.additionalItems||false):schema.items;
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
};

module.exports = Validator;
