[![Build Status](https://secure.travis-ci.org/tdegrunt/jsonschema.png)](http://travis-ci.org/tdegrunt/jsonschema)

# jsonschema
Simple and fast [JSON schema](http://tools.ietf.org/html/draft-zyp-json-schema-03) validator.

## Usage

### Simple
Simple object validation using JSON schemas.

```javascript
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
      "country": {"type": "string", "required": true}
    }
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

  var v = new Validator();
  v.addSchema(addressSchema, '/SimpleAddress');
  console.log(v.validate(p, schema));
```

## Features

### Definitions
All schema definitions are supported, $schema is ignored.

### Types
All types are supported

### String Formats
All formats are supported, phone numbers are expected to follow the [http://en.wikipedia.org/wiki/E.123](E.123) standard.

### Custom properties
Specify your own JSON Schema properties with the validator.attributes property:

```javascript
validator.attributes.contains = function validateContains(instance, schema, options, ctx) {
  if(typeof instance!='string') return;
  if(typeof schema.contains!='string') throw new jsonschema.SchemaError('"contains" expects a string', schema);
  if(instance.indexOf()<0){
    return 'does not contain the string '+JSON.stringify(schema.contains);
  }
}
var result = validator.validate({x:0, y:10}, {type:"object", radius:{x:10, y:10, radius:5}});

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

## Tests
Uses [https://github.com/Julian/JSON-Schema-Test-Suite](JSON Schema Test Suite) as well as our own.
You'll need to update and init the git submodules:

    git submodule update --init
    npm test

## License
jsonschema is licensed under MIT license.

  Copyright (C) 2012 Tom de Grunt <tom@degrunt.nl>

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
