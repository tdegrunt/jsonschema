'use strict';

var uri = require('url');

var attribute = require('./attribute');
var helpers = require('./helpers');
var ValidatorResult = helpers.ValidatorResult;
var SchemaError = helpers.SchemaError;
var SchemaContext = helpers.SchemaContext;

/**
 * Creates a new Validator object
 * @name Validator
 * @constructor
 */
var Validator = function Validator() {
  this.schemas = {};

  // Use Object.create to make this extensible without Validator instances stepping on each other's toes.
  this.types = Object.create(types);
  this.attributes = Object.create(attribute.validators);
};

// Hint at the presence of a property
Validator.schemas = null;
Validator.types = null;
Validator.attributes = null;

/**
 * Adds a schema with a certain urn to the Validator instance.
 * @param schema
 * @param urn
 * @return {Object}
 */
Validator.prototype.addSchema = function addSchema(schema, urn) {
  if (!schema) {
    return null;
  }
  var ourUrn = urn || schema.id;
  if (ourUrn) {
    this.schemas[ourUrn] = schema;
  }
  return this.schemas[ourUrn];
};

/**
 * Sets all the schemas of the Validator instance.
 * @param schemas
 */
Validator.prototype.setSchemas = function setSchemas(schemas) {
  this.schemas = schemas;
};

/**
 * Returns the schema of a certain urn
 * @param urn
 */
Validator.prototype.getSchema = function getSchema(urn) {
  return this.schemas[urn];
};

/**
 * Validates instance against the provided schema
 * @param instance
 * @param schema
 * @param [options]
 * @param [ctx]
 * @return {Array}
 */
Validator.prototype.validate = function validate(instance, schema, options, ctx) {
  if(!options) options = {};
  var propertyName = options.propertyName || 'instance';
  // This will work so long as the function at uri.resolve() will resolve a relative URI to a relative URI
  var base = uri.resolve(options.base||'/', schema.id||'');
  if(!ctx){
    ctx = (new SchemaContext(schema, options, propertyName, base, Object.create(this.schemas)));
    if(!ctx.schemas[base]) ctx.schemas[base] = schema;
  }
  if (schema) {
    var result = this.validateSchema(instance, schema, options, ctx);
    if(!result) throw new Error('Result undefined');
    return result.errors;
  }
  throw new SchemaError('no schema specified', schema);
};

/**
 * Validates an instance against the schema (the actual work horse)
 * @param instance
 * @param schema
 * @param options
 * @param ctx
 * @private
 * @return {Array}
 */
Validator.prototype.validateSchema = function validateSchema(instance, schema, options, ctx) {
  var self = this;
  var result = new ValidatorResult(instance, schema, options, ctx);
  if(!schema){
    throw new Error("schema is undefined");
  }

  if (schema.extends) {
    if(schema.extends instanceof Array) {
      schema.extends.forEach(function(s) {
        schema = helpers.deepMerge(schema, s);
      });
    } else {
      schema = helpers.deepMerge(schema, schema.extends);
    }
  }

  var switchSchema = (typeof schema === 'string') ? schema : schema.$ref;
  if (typeof switchSchema=='string') {
    switchSchema = ctx.resolve(switchSchema);
    // First see if the schema exists under the provided URI
    if (ctx.schemas[switchSchema]) {
      var subschema = ctx.schemas[switchSchema];
      var subctx = new SchemaContext(ctx.schemas[switchSchema], options, ctx.propertyPath, switchSchema, ctx.schemas);
      return this.validateSchema(instance, subschema, options, subctx);
    }
    // Else try walking the property pointer
    var parsed = uri.parse(switchSchema);
    var fragment = parsed && parsed.hash;
    var document = fragment && fragment.length && switchSchema.substr(0, switchSchema.length-fragment.length);
    if (document && ctx.schemas[document]) {
      var subschema = helpers.objectGetPath(ctx.schemas[document], fragment.substr(1));
      if(subschema===undefined){
        throw new SchemaError("no such schema " + fragment + " located in <" + document + ">", schema);
      }
      var subctx = new SchemaContext(subschema, options, ctx.propertyPath, switchSchema, ctx.schemas);
      return this.validateSchema(instance, subschema, options, subctx);
    }
    throw new SchemaError("no such schema <" + switchSchema + ">", schema);
  }

  var skipAttributes = options&&options.skipAttributes || [];
  // Validate each schema attribute against the instance
  for(var key in schema){
    if (!attribute.ignoreProperties[key] && skipAttributes.indexOf(key) < 0) {
      var validatorErr;
      var validator = self.attributes[key];
      if (validator) {
        validatorErr = validator.call(self, instance, schema, options, ctx);
      } else if(options.allowUnknownAttributes===false) {
        // This represents an error with the schema itself, not an invalid instance
        throw new SchemaError("Unsupported attribute: "+key, schema);
      }
      if (validatorErr) {
        result.importErrors(validatorErr);
      }
    }
  }

  if(typeof options.rewrite=='function'){
    var value = options.rewrite.call(this, instance, schema, options, ctx);
    result.instance = value;
  }
  return result;
};

/**
 * Tests whether the instance if of a certain type.
 * @private
 * @param instance
 * @param schema
 * @param options
 * @param ctx
 * @param type
 * @return {boolean}
 */
Validator.prototype.testType = function validateType(instance, schema, options, ctx, type){
  if(typeof this.types[type]=='function') return this.types[type].call(this, instance);
  if(type && typeof type=='object'){
    var res = this.validateSchema(instance, type, options, ctx);
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
  // TODO: fix this - see #15
  return instance && (typeof instance) === 'object' && !(instance instanceof Array) && !(instance instanceof Date);
}

module.exports = Validator;
