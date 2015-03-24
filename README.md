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

### Specific format
jsonschema defines all standard formats.
But, in some cases, you may want to define a specific format as if it is was a standard.
For example, if you use Mongodb as database, `objectid` is a standard to you.
You can describe it as a `type` or as a `format`... or more interesting : both.

```javascript
  var ObjectID = require('mongodb').ObjectID;
  Validator.prototype.types.objectid = function testObjectID (instance) {
        return instance instanceof ObjectID;
  };
```

```javascript
  Validator.prototype.addFormat("objectid", /^[0-9a-fA-F]{24}$/);
```

You can make your validator check the value is either an `ObjectId` object type or a string with `objectid` format.

```javascript
var schema= {
        "id" : "/MySchema",
        "type" : "object",
        "properties" : {
            "_id" : {
                "type" : ["string", "objectid"],
                "format" : "objectid"
            }
        },
        "additionalProperties" : false
};
```

In this example, the property `_id` is valid if :
*  it is a string and this string matches the `objectid` pattern (ie : /^[0-9a-fA-F]{24}$/)
*  or it is an ObjectId

Then both cases bellow will work

```javascript
var struct = {"_id" : new ObjectID()};
var validation = v.validate(struct, schema);
console.log('%j', validation.errors); // No error : _id is an "ObjectID" object then "testObjectID" we configured before returns true.

struct = {"_id" : new ObjectID().toString()};
validation = v.validate(struct, schema);
console.log('%j', validation.errors); // No error : _id is a string and its value matches "objectid" format pattern we added by "Validator.prototype.addFormat" function.
```

### String value replacement depending on the format

When you receive a json structure in a REST service or when you read json from a file... you may want to cast some property values to an object.
For example, when you receive a date, it is read as a string in ISO8601 format.
After validating your json, you may want to manipulate all the dates as Date objects instead of strings.
You can configure a validator to do this. We can make it replace string values by an associated object depending on the `format` attribute.
This configuration has to be made on each validator instance. It also means you can have different configurations if you have many validators in your app.

The property we have to add is a structure named `replacingValueIfStringIsFormat`.

```javascript
  var Validator = require('jsonschema').Validator;
  var v = new Validator();
  v.replacingValueIfStringIsFormat = {
          "date-time" : Date,
          "objectid" : ObjectID
  };
```

Then, we can validate json structures :

```javascript
var schema1= {
        "id" : "/Schema1",
        "type" : "object",
        "properties" : {
            "mydate" : {
                "type" : ["string", "date"],
                "format" : "date-time"
            }
        },
        "additionalProperties" : false
 };

var schema2= {
        "id" : "/Schema2",
        "type" : "object",
        "properties" : {
            "_id" : {
                "type" : ["string", "objectid"],
                "format" : "objectid"
            }
        },
        "additionalProperties" : false
 };


var struct = {"mydate" : new Date()};
var validation = v.validate(struct, schema1);
console.log('Date validation with a date : %j', validation.errors); // No error : my property is a already a Date object
console.log('After validation : ' + (struct.mydate instanceof Date); // After validation struct.mydate is still a Date object

struct = {"mydate" : new Date().toISOString()};
var validation = v.validate(struct, schema1);
console.log('Date validation with a string date : %j', validation.errors); // No error : my property is a string with ISO8601 date format
console.log('After validation : ' + (struct.mydate instanceof Date); // After validation struct.mydate is NOW a Date object


struct = {"_id" : new ObjectID()};
var validation = v.validate(struct, schema2);
console.log('ObjectID validation with a Mongodb ObjectID object : %j', validation.errors); // No error : my property is already an ObjectID object
console.log('After validation : ' + (struct._id instanceof ObjectID); // After validation struct._id is still an ObjectID object

struct = {"_id" : new ObjectID().toString()};
var validation = v.validate(struct, schema2);
console.log('ObjectID validation with a Mongodb ObjectID as string : %j', validation.errors); // No error : my property is a string representation of an ObjectID then the value matches the pattern
console.log('After validation : ' + (struct._id instanceof ObjectID); // After validation struct._id is NOW an ObjectID object
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
