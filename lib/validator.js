'use strict';

var Attribute = require('./attribute');
var helpers = require('./helpers');

var Validator = function Validator() {
  this.schemas = {};
  this.errors = [];
  return this;
};

Validator.prototype.addSchema = function (schema, urn) {
  var ourUrn = urn;

  if (!schema) {
    return;
  }

  if (!urn) {
    ourUrn = schema.id;
  }
  if (ourUrn) {
    this.schemas[ourUrn] = schema;
  }
  return this.schemas[ourUrn];
};

Validator.prototype.setSchemas = function (schemas) {
  this.schemas = schemas;
};

Validator.prototype.addError = function (error) {
  if (error) {
    this.errors.push(error);
  }
};

Validator.prototype.validate = function (instance, schema, options) {
  if (helpers.isDefined(schema)) {
    if (typeof schema.type === 'object' && (schema.type instanceof Array)) {
      this.validateUnionType(instance, schema, options);
    } else {
      this.validateSchema(instance, schema, options);
    }
  }
  return this.errors;
};

Validator.prototype.validateSchema = function (instance, schema, options) {
  if (helpers.isDefined(schema.type)) {
    switch (schema.type) {
    case 'string':
    case 'number':
    case 'integer':
    case 'boolean':
    case 'null':
    case 'date':
    case 'any':
      return this.validateProperty(instance, schema, options);
    case 'object':
      return this.validateObject(instance, schema, options);
    case 'array':
      return this.validateArray(instance, schema, options);
    }
  }
  if (schema.$ref) {
    return this.validateProperty(instance, schema, options);
  }
};

Validator.prototype.validateProperty = function (instance, schema, options) {
  var a;
  var valid;
  if (!helpers.isDefined(options)) {
    options = {addError: true, skipAttributes: []};
  } else {
    if (!helpers.isDefined(options.addError) || helpers.isNull(options.addError)) {
      options.addError = true;
    }
    if (!helpers.isDefined(options.skipAttributes) || helpers.isNull(options.skipAttributes)) {
      options.skipAttributes = [];
    }
  }
  var key, i;
  var keys = Object.keys(schema);
  var keysLength = keys.length;
  for (i = 0; i < keysLength; i++) {
    key = keys[i];
    if (options.skipAttributes.indexOf(key) === -1) {
      a = new Attribute(this, key, schema, instance, options.propertyName, options);
      valid = a.validate();

      if (options.addError === true) {
        this.addError(valid);
      }
    }
  }
  return valid;
};

Validator.prototype.validateObject = function (instance, schema, options) {
  var a;
  var prop;
  // Only validate undefined's if they are required
  if (!helpers.isDefined(instance)) {
    if (helpers.isDefined(schema) && schema.required === true) {
      this.addError(helpers.createError(schema, undefined, options.propertyName, "is required", instance));
    }
    return;
  }
  if (typeof instance !== 'object') {
    if (!helpers.isDefined(options) || (helpers.isDefined(options) && options.addError === true)) {
      this.addError(helpers.createError(schema, undefined, undefined, "not an object", instance));
    }
  } else {
    var property, i;
    if (helpers.isDefined(schema.properties)) {
      this.validateAdditionalProperties(instance, schema, options);
      var keys = Object.keys(schema.properties);
      var keysLength = keys.length;
      for (i = 0; i < keysLength; i++) {
        property = keys[i];
        if (helpers.isDefined(instance) && !helpers.isNull(instance) && helpers.isDefined(instance[property])) {
          prop = instance[property];
        } else {
          prop = undefined;
        }
        this.validate(prop, schema.properties[property], {'propertyName': property, 'addError': true});
      }
    }
  }
};

Validator.prototype.validateAdditionalProperties = function (instance, schema, options) {
  if (!helpers.isDefined(schema.additionalProperties) || schema.additionalProperties === true) {
    return;
  }

  var property, i;
  var keys = Object.keys(instance);
  var keysLength = keys.length;
  for (i = 0; i < keysLength; i++) {
    property = keys[i];
    if (!helpers.isDefined(schema.properties[property])) {
      if (schema.additionalProperties === false) {
        this.addError("Property " + property + " does not exist in the schema");
      } else {
        this.validate(instance[property], schema.additionalProperties, options);
      }
    }
  }
};

// FIXME: This will fail if the schema doesn't have 'items' defined
Validator.prototype.validateArray = function (instance, schema, options) {
  var a, i, len;
  // Don't validate undefined's
  if (!helpers.isDefined(instance)) {
    return;
  }
  if (!(instance instanceof Array)) {
    this.addError("not an array");
  } else {
    if (!options) {
      options = {skipAttributes: ['items', 'type']};
    } else {
      if (options.skipAttributes === undefined || options.skipAttributes === null) {
        options.skipAttributes = ['items', 'type'];
      }
    }
    this.validateProperty(instance, schema, options);
    options.skipAttributes = [];
    for (i = 0, len = instance.length; i < len; i++) {
      if (options && options.propertyName) {
        options.propertyName = options.propertyName.concat("[", i, "]");
      }
      this.validate(instance[i], schema.items, options);
    }
  }
};

Validator.prototype.validateUnionType = function (instance, schema, options) {
  var i, len;
  var errors = [];
  for (i = 0, len = schema.type.length; i < len; i++) {
    if (typeof schema.type[i] === 'string') {
      this.validateSchema(instance, {'type': schema.type[i]});
    } else {
      this.validateSchema(instance, schema.type[i]);
    }

    if (this.errors.length === 0) {
      // early exit one element of the union passes the test
      return;
    } else {
      // reset
      errors = errors.concat(this.errors);
      this.errors = [];
    }
  }

  this.errors = errors;

  if (this.errors.length !== 0) {
      this.addError("not any of union type");
  }
};

module.exports = Validator;
