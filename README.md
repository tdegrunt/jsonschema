[![Build Status](https://secure.travis-ci.org/tdegrunt/jsonschema.png)](http://travis-ci.org/tdegrunt/jsonschema)

# jsonschema
[JSON schema](http://json-schema.org/) validator, which is designed to be fast and simple to use.
The latest IETF published draft is v4, this library is mostly v4 compatible.

## Contributing & bugs
Please fork the repository, make the changes in your fork and include tests. Once you're done making changes, send in a pull request.

### Bug reports
Please include a test which shows why the code fails.

## Usage

### Simple
Simple object validation using JSON schemas.

```javascript
  var Validator = require('jsonschema').Validator;
  var v = new Validator();
  var instance = 4;
  var schema = {"type": "number"};
  console.log(v.validate(instance, schema));
```

### Even simpler

```javascript
  var validate = require('jsonschema').validate;
  console.log(validate(4, {"type": "number"}));
```

### Complex example, with split schemas and references

```javascript
  var Validator = require('jsonschema').Validator;
  var v = new Validator();

  // Address, to be embedded on Person
  var addressSchema = {
    "id": "/SimpleAddress",
    "type": "object",
    "properties": {
      "lines": {
        "type": "array",
        "items": {"type": "string"}
      },
      "zip": {"type": "string"},
      "city": {"type": "string"},
      "country": {"type": "string"}
    },
    "required": ["country"]
  };

  // Person
  var schema = {
    "id": "/SimplePerson",
    "type": "object",
    "properties": {
      "name": {"type": "string"},
      "address": {"$ref": "/SimpleAddress"},
      "votes": {"type": "integer", "minimum": 1}
    }
  };

  var p = {
    "name": "Barack Obama",
    "address": {
      "lines": [ "1600 Pennsylvania Avenue Northwest" ],
      "zip": "DC 20500",
      "city": "Washington",
      "country": "USA"
    },
    "votes": "lots"
  };

  v.addSchema(addressSchema, '/SimpleAddress');
  console.log(v.validate(p, schema));
```

## Features

### Definitions
All schema definitions are supported, $schema is ignored.

### Types
All types are supported

### String Formats
All formats are supported, phone numbers are expected to follow the [E.123](http://en.wikipedia.org/wiki/E.123) standard.

### Results
The first error found will be thrown as an `Error` object if `options.throwError` is `true`.  Otherwise all results will be appended to the `result.errors` array which also contains the success flag `result.valid`.

### Custom properties
Specify your own JSON Schema properties with the validator.attributes property:

```javascript
validator.attributes.contains = function validateContains(instance, schema, options, ctx) {
  if(typeof instance!='string') return;
  if(typeof schema.contains!='string') throw new jsonschema.SchemaError('"contains" expects a string', schema);
  if(instance.indexOf(schema.contains)<0){
    return 'does not contain the string ' + JSON.stringify(schema.contains);
  }
}
var result = validator.validate("i am an instance", { type:"string", contains: "i am" });
// result.valid === true;
```

The instance passes validation if the function returns nothing. A single validation error is produced
if the fuction returns a string. Any number of errors (maybe none at all) may be returned by passing a
`ValidatorResult` object, which may be used like so:

```javascript
  var result = new ValidatorResult(instance, schema, options, ctx);
  while(someErrorCondition()){
    result.addError('fails some validation test');
  }
  return result;
```

### Dereferencing schemas
Sometimes you may want to download schemas from remote sources, like a database, or over HTTP. When importing a schema,
unknown references are inserted into the `validator.unresolvedRefs` Array. Asynchronously shift elements off this array and import
them:

```javascript
  var Validator = require('jsonschema').Validator;
  var v = new Validator();
  v.addSchema(initialSchema);
  function importNextSchema(){
    var nextSchema = v.unresolvedRefs.shift();
    if(!nextSchema){ done(); return; }
    databaseGet(nextSchema, function(schema){
      v.addSchema(schema);
      importNextSchema();
    });
  }
  importNextSchema();
```

### Custom error messages / i18n

Specify your own error messages with the ValidatorResult.mapErrors function:

```javascript
var Validator = require('jsonschema').Validator;
var v = new Validator();

var errorMap = {
  "en": {
    'instance.customPropertyMessage': 'Custom error message',
    'instance.customValidatorTypeMessage': {
      'message': 'Custom general message',
      'minimum': 'Must be greater than three'
    },
    'instance.customValidatorSubTypeMessage': {
      'format': {
        'ipv4': 'Not an IP address'
      }
    },
    'instance.array1': {
      'minItems': 'Not enough items'
    },
    'instance.array2': {
      'minItems': 'Not enough items'
    },
    'instance.array2[]': {
      type: 'Array item must be an integer'
    },
    'instance.array2[3]': {
      type: 'Array item 3 must be an integer'
    }
  },
  "fr": {
    'instance.customPropertyMessage': "Message d'erreur personnalisé",
    'instance.customValidatorTypeMessage': {
      'message': "Message personnalisé générale",
      'minimum': 'Doit être supérieur à trois',
    },
    'instance.customValidatorSubTypeMessage': {
      'format': {
        'ipv4': 'Pas une adresse IP'
      }
    }
  }
};

var schema = {
  "id": "/i18n",
  "type": "object",
  "properties": {
    noCustomMessage: {
      type: 'integer'
    },
    customPropertyMessage: {
      type: 'integer'
    },
    customValidatorTypeMessage: {
      type: 'integer',
      minimum: 3
    },
    customValidatorSubTypeMessage: {
      type: 'string',
      format: 'ipv4'
    },
    array1: {
      type: 'array',
      minItems: 2
    },
    array2: {
      type: 'array',
      minItems: 2,
      items: {
        type: 'integer'
      }
    }
  }
};

var instance = {
  noCustomMessage: 'not-an-int',
  customPropertyMessage: 'not-an-int',
  customValidatorTypeMessage: 2, // Below minimum
  customValidatorSubTypeMessage: 'not-an-IP-address',
  array1: [1],
  array2: [1, 2, 'a', 'b']
};

var resultEnglish = v.validate(instance, schema).mapErrors(errorMap.en);
var resultFrench = v.validate(instance, schema).mapErrors(errorMap.fr);
```

Or use a custom function to provide your own error message mappings:

```javascript
var resultCustom = v.validate(instance, schema).mapErrors(function (err) {
  if (!err) return err;

  // The path to the property
  var propPath = err.property;
  // The validator type (name of validator)
  var validatorType = err.validatorType;
  // The validator sub-type (only applicable for validators like format)
  var validatorSubType = err.validatorSubType;

  if (propPath === 'instance.customValidatorSubTypeMessage'
    && validatorType === 'format'
    && validatorSubType === 'ipv4') {
      err.message = 'Not an IP address';
      return err;
  }

  return err;
}));
```

## Tests
Uses [JSON Schema Test Suite](https://github.com/json-schema/JSON-Schema-Test-Suite) as well as our own tests.
You'll need to update and init the git submodules:

    git submodule update --init
    npm test

## Contributions

This library would not be possible without the valuable contributions by:

- Austin Wright

... and many others!

## License

    jsonschema is licensed under MIT license.

    Copyright (C) 2012-2015 Tom de Grunt <tom@degrunt.nl>

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
    of the Software, and to permit persons to whom the Software is furnished to do
    so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
