'use strict';

var jsonschema = require('..');
var validator = new jsonschema.Validator;

function preValidateProperty(object, key, schema, options, ctx) {
  var value = object[key];
  if (typeof value === 'undefined') return;

  // Test if the schema declares a type, but the type keyword fails validation
  if (schema.type && validator.attributes.type.call(validator, value, schema, options, ctx.makeChild(schema, key))) {
    // If the type is "number" but the instance is not a number, cast it
    if(schema.type==='number' && typeof value!=='number'){
      object[key] = parseFloat(value);
      return;
    }
    // If the type is "string" but the instance is not a string, cast it
    if(schema.type==='string' && typeof value!=='string'){
      object[key] = String(value).toString();
      return;
    }
  }
}

const schema = {
  properties: {
    name: { type: 'string' },
    quantity: { type: 'number' },
  },
};

const instance = {
  name: 123,
  quantity: "2",
};

// And now, to actually perform validation with the coercion hook!
var res = validator.validate(instance, schema, { preValidateProperty });

console.log(instance);
console.log(res.valid);
