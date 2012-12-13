'use strict';

var attribute = require('./attribute');
var helpers = require('./helpers');

/**
 * Creates a new Validator object
 * @return {*}
 * @constructor
 */
var Validator = function Validator() {
  this.schemas = {};
  return this;
};

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

Validator.prototype.validate = function validate(instance, schema, options, propertyName) {
  if (!propertyName) {
    propertyName = 'instance';
  }
  if (schema) {
    return this.validateSchema(instance, schema, options, propertyName);
  }
  throw new Error('no schema specified');
};

Validator.prototype.validateSchema = function validateSchema(instance, schema, options, propertyName) {
  if (!schema) {
    return [helpers.createError(schema, undefined, undefined, "is undefined")];
  }
  var switchSchema = (typeof schema === 'string') ? schema : schema.$ref;
  if (switchSchema) {
    if (this.schemas[switchSchema]) {
      return this.validateSchema(instance, this.schemas[switchSchema], options, propertyName);
    }
    return [helpers.createError(schema, '$ref', propertyName, "no such schema " + switchSchema)];
  }
  var errs = this.validateProperty(instance, schema, options, propertyName);
  if (instance instanceof Array) {
    return errs.concat(this.validateArray(instance, schema, options, propertyName));
  }
  if (instance && (typeof instance) === 'object' && Object.getPrototypeOf(instance) === Object.prototype) {
    return errs.concat(this.validateObject(instance, schema, options, propertyName));
  }
  return errs;
};

// Validates each schema property against the instance
Validator.prototype.validateProperty = function validateProperty(instance, schema, options, propertyName) {
  var self = this;
  var errors = [];
  var skipAttributes = (options && options.skipAttributes) || [];
  var keys = Object.keys(schema);
  keys.forEach(function (key) {
    if (skipAttributes.indexOf(key) < 0 && attribute.ignoreProperties.indexOf(key) < 0) {
      var validatorErr;
      var validator = attribute.validators[key];
      if (validator) {
        validatorErr = validator.call(self, instance, schema, options, propertyName);
      } else {
        validatorErr = "WARNING: unsupported attribute: " + key;
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
  if (instance === undefined) {
    if (schema && schema.required === true) {
      errors.push(helpers.createError(schema, undefined, propertyName, "is required", instance));
    }
    return errors;
  }
  if ((typeof instance !== 'object' || instance) && Object.getPrototypeOf(instance) !== Object.prototype) {
    errors.push(helpers.createError(schema, undefined, undefined, "not an object", instance));
    return errors;
  }

  var properties = schema.properties || {};

  var property;
  var errs;

  // true is the same as the default, an empty schema, which needs no validation
  if (schema.additionalProperties !== undefined && schema.additionalProperties !== true) {
    for (property in instance) {
      if (instance.hasOwnProperty(property)) {
        if (properties[property] !== undefined) {
          continue;
        }
        if (schema.additionalProperties === false) {
          errors.push("Property " + property + " does not exist in the schema");
        } else {
          errs = this.validateSchema(instance[property], schema.additionalProperties, options, propertyName + helpers.makeSuffix(property));
          if (errs && errs.length) {
            errors = errors.concat(errs);
          }
        }
      }
    }
  }

  var patternProperties = schema.patternProperties || {};
  var pattern;
  for (pattern in patternProperties) {
    if (patternProperties.hasOwnProperty(pattern)) {
      var expr = new RegExp(pattern);
      for (property in instance) {
        if (instance.hasOwnProperty(property)) {
          if (!expr.test(property)) {
            continue;
          }
          errs = this.validateSchema(instance[property], schema.additionalProperties, options, propertyName + helpers.makeSuffix(property));
          if (errs && errs.length) {
            errors = errors.concat(errs);
          }
        }
      }
    }
  }

  for (property in properties) {
    if (properties.hasOwnProperty(property)) {
      var prop = (instance || undefined) && instance[property];
      errs = this.validate(prop, properties[property], options, propertyName + helpers.makeSuffix(property));
      if (errs && errs.length) {
        errors = errors.concat(errs);
      }
    }
  }
  return errors;
};

Validator.prototype.validateArray = function (instance, schema, options, propertyName) {
  var self = this;
  if (instance === undefined || !schema.items) {
    return [];
  }
  var errors = [];
  instance.every(function (value, i) {
    var items = (schema.items instanceof Array) ? (schema.items[i] || schema.additionalItems || false) : schema.items;
    if (items === false) {
      errors.push("additionalItems not permitted");
      return false;
    }
    var errs = self.validateSchema(value, items, options, propertyName + "[" + i + "]");
    if (errs && errs.length) {
      errors = errors.concat(errs);
    }
    return true;
  });
  return errors;
};

module.exports = Validator;
