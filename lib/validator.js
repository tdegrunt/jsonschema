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
        // This represents an error with the schema itself, not an invalid instance
        throw new Error("Unsupported attribute: "+key);
      }
      if (validatorErr) {
        result.importErrors(validatorErr);
      }
    }
  });
  return result;
};

module.exports = Validator;
