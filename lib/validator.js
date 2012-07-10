'use strict';

var Attribute = require('./attribute');

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

Validator.prototype.addError = function (error) {
  if (error) {
    this.errors.push(error);
  }
};


Validator.prototype.validate = function (instance, schema, options) {
  if (typeof schema.type === 'object' && (schema.type instanceof Array)) {
    this.validateUnionType(instance, schema, options);
  } else {
    this.validateSchema(instance, schema, options);
  }
  return this.errors;
};

Validator.prototype.validateSchema = function (instance, schema, options) {
  var basicTypes = ['string', 'number', 'integer', 'boolean', 'null', 'date', 'any'];

  if (schema.type) {
    if (basicTypes.indexOf(schema.type) >= 0) {
      return this.validateProperty(instance, schema, options);
    }
    if (schema.type === 'object') {
      return this.validateObject(instance, schema, options);
    }
    if (schema.type === 'array') {
      return this.validateArray(instance, schema, options);
    }
  }
  if (schema.$ref) {
    return this.validateProperty(instance, schema, options);
  }
};

Validator.prototype.validateProperty = function (instance, schema, options) {
  var a;
  var valid = null;
  if (!options) {
    options = {addError: true, skipAttributes: []};
  } else {
    if (options.addError === undefined || options.addError === null) {
      options.addError = true;
    }
    if (options.skipAttributes === undefined || options.skipAttributes === null) {
      options.skipAttributes = [];
    }
  }
  for (var key in schema) {
    if (schema.hasOwnProperty(key) && options.skipAttributes.indexOf(key) === -1) {
      a = new Attribute(this, key, schema, instance, options.propertyName);
      valid = a.validate();

      if (options.addError === true) {
        this.addError(valid);
      }
    }
  }
  return (valid === undefined);
};

Validator.prototype.validateObject = function (instance, schema) {
  var a;
  var prop;
  // Don't validate undefined's
  if (instance === undefined) {
    return;
  }
  if (typeof instance !== 'object') {
    this.addError("not an object");
  } else {
    for (var property in schema.properties) {
      if (schema.properties.hasOwnProperty(property)) {
        if (instance && instance[property]) {
          prop = instance[property];
        } else {
          prop = undefined;
        }
        this.validate(prop, schema.properties[property], {'propertyName': property});
      }
    }
  }
};

// FIXME: This will fail if the schema doesn't have 'items' defined
Validator.prototype.validateArray = function (instance, schema, options) {
  var a, i;
  // Don't validate undefined's
  if (instance === undefined) {
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
    for (i = 0; i < instance.length; i++) {
      if (options && options.propertyName) {
        options.propertyName = options.propertyName.concat("[", i, "]");
      }
      this.validate(instance[i], schema.items, options);
    }
  }
};

Validator.prototype.validateUnionType = function (instance, schema, options) {
  var i;
  var valid = false;
  for (i = 0; i < schema.type.length; i++) {
    if (typeof schema.type[i] === 'string') {
      valid = this.validateSchema(instance, {'type': schema.type[i]}, {'addError': false});
    } else {
      valid = this.validateSchema(instance, schema.type[i], {'addError': false});
    }
    if (valid) {
      break;
    }
  }
  if (!valid) {
    this.addError("not any of " + schema.type.join(','));
  }
};

module.exports = Validator;