'use strict';

var attribute = require('./attribute');
var helpers = require('./helpers');
var ValidatorResult = helpers.ValidatorResult;
var ValidationError = helpers.ValidationError;

var Validator = function Validator() {
  this.schemas = {};

  // Use Object.create to make this extensible without Validator instances stepping on each other's toes.
  this.types = Object.create(types);
  this.attributes = Object.create(attribute.validators);
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

  var skipAttributes = options&&options.skipAttributes || [];
  // Validate each schema attribute against the instance
  var keys = Object.keys(schema);
  keys.forEach(function(key){
    if (skipAttributes.indexOf(key)<0 && attribute.ignoreProperties.indexOf(key)<0) {
      var validatorErr;
      var validator = self.attributes[key];
      if (validator) {
        validatorErr = validator.call(self, instance, schema, options, propertyName);
      } else if(options.allowUnknownAttributes===false) {
        // This represents an error with the schema itself, not an invalid instance
        throw new Error("Unsupported attribute: "+key);
      }
      if (validatorErr) {
        result.importErrors(validatorErr);
      }
    }
  });

  if(typeof options.rewrite=='function'){
    var value = options.rewrite.call(this, instance, schema, options, propertyName);
    result.instance = value;
  }
  return result;
};

Validator.prototype.testType = function validateType(instance, schema, options, propertyName, type){
  if(typeof this.types[type]=='function') return this.types[type].call(this, instance);
  if(type && typeof type=='object'){
    var res = this.validateSchema(instance, type, options, propertyName);
    return res===undefined || !(res&&res.errors.length);
  }
  // Undefined or properties not on the list are acceptable, same as not being defined
  return true;
}

var types = Validator.prototype.types = {};
types.string = function testString(instance){ return typeof instance=='string';  }
types.number = function testNumber(instance){ return typeof instance=='number'; }
types.integer = function testInteger(instance){ return (typeof instance=='number') && instance%1===0; }
types.boolean = function testBoolean(instance){ return typeof instance=='boolean'; }
types.number = function testNumber(instance){ return typeof instance=='number'; }
types.array = function testArray(instance){ return instance instanceof Array; }
types.null = function testNull(instance){ return instance===null; }
types.date = function testDate(instance){ return instance instanceof Date; }
types.any = function testAny(instance){ return true; }
types.object = function testObject(instance){
  return instance && (typeof instance)=='object' && Object.getPrototypeOf(instance)===Object.prototype;
}

module.exports = Validator;
