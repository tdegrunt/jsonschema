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
  if (schema!==undefined) {
    if (schema.type instanceof Array) {
      this.validateUnionType(instance, schema, options);
    } else {
      this.validateSchema(instance, schema, options);
    }
  }
  return this.errors;
};

Validator.prototype.validateSchema = function (instance, schema, options) {
  if (schema.type) {
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
  var self=this;
  var a;
  var valid;
  if (!options) {
    options = {addError: true, skipAttributes: []};
  } else {
    if (options.addError===undefined || options.addError===null) {
      options.addError = true;
    }
    if (options.skipAttributes===undefined || options.skipAttributes===null) {
      options.skipAttributes = [];
    }
  }
  var keys = Object.keys(schema);
  keys.forEach(function(key){
    if (options.skipAttributes.indexOf(key) === -1) {
      a = new Attribute(self, key, schema, instance, options.propertyName, options);
      valid = a.validate();

      if (options.addError === true) {
        self.addError(valid);
      }
    }
  });
  return valid;
};

Validator.prototype.validateObject = function (instance, schema, options) {
  var self=this;
  // Only validate undefined's if they are required
  if (instance===undefined) {
    if (schema && schema.required===true) {
      this.addError(helpers.createError(schema, undefined, options.propertyName, "is required", instance));
    }
    return;
  }
  if (typeof instance !== 'object') {
    if (options===undefined || (options && options.addError === true)) {
      this.addError(helpers.createError(schema, undefined, undefined, "not an object", instance));
    }
  } else {
    var property;
    if (schema.properties) {
      this.validateAdditionalProperties(instance, schema, options);
      var keys = Object.keys(schema.properties);
      keys.forEach(function(property){
        var prop = (instance||undefined) && instance[property];
        self.validate(prop, schema.properties[property], {'propertyName': property, 'addError': true});
      });
    }
  }
};

Validator.prototype.validateAdditionalProperties = function (instance, schema, options) {
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
        self.validate(instance[property], schema.additionalProperties, options);
      }
    }
  });
};

// FIXME: This will fail if the schema doesn't have 'items' defined
Validator.prototype.validateArray = function (instance, schema, options) {
  var self=this;
  if (instance===undefined) return;
  if (!(instance instanceof Array)) {
    this.addError("not an array");
    return;
  }
  if (!options) {
    options = {skipAttributes: ['items', 'type']};
  } else {
    if (options.skipAttributes === undefined || options.skipAttributes === null) {
      options.skipAttributes = ['items', 'type'];
    }
  }
  this.validateProperty(instance, schema, options);
  options.skipAttributes = [];
  instance.forEach(function(value, i){
    if (options && options.propertyName) {
      options.propertyName = options.propertyName.concat("[", i, "]");
    }
    self.validate(value, schema.items, options);
  });
 };

Validator.prototype.validateUnionType = function (instance, schema, options) {
  var numErrors = this.errors.length;
  var startingNumErrors = numErrors;
  var valid = false;
  for (var i=0, len=schema.type.length; i<len; i++) {
    if (typeof schema.type[i] === 'string') {
      this.validateSchema(instance, {'type': schema.type[i]});
    } else {
      this.validateSchema(instance, schema.type[i]);
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
