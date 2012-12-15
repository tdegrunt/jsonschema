[![Build Status](https://secure.travis-ci.org/tdegrunt/jsonschema.png)](http://travis-ci.org/tdegrunt/jsonschema)

# jsonschema

Simple and fast [JSON schema](http://tools.ietf.org/html/draft-zyp-json-schema-03) validator.

## Usage
```javascript
	var v = new Validator();
	var instance = 4;
	var schema = {"type": "number"};
	console.log(v.validate(instance, schema));
```

## Features

### Definitions

Any non ticked off definition types are ignored.

| Value | JSON Schema Draft | jsonschema | Comments |
|:------|:-----------------:|:----------:|:---------|
| type  | ✔ | ✔ |
| properties | ✔ | ✔ |
| patternProperties  | ✔ | ✔ |
| additionalProperties | ✔ | ✔ |
| items  | ✔ | ✔ |
| additionalItems  | ✔ | ✔ |
| required | ✔ | ✔ |
| dependencies | ✔ | ✔ |
| minimum  | ✔ | ✔ |
| maximum  | ✔ | ✔ |
| exclusiveMinimum | ✔ | ✔ |
| exclusiveMaximum | ✔ | ✔ |
| minItems | ✔ | ✔ |
| maxItems | ✔ | ✔ |
| uniqueItems  | ✔ | ✔ |
| pattern  | ✔ | ✔ |
| minLength  | ✔ | ✔ |
| maxLength  | ✔ | ✔ |
| enum | ✔ | ✔ |
| default  | ✔ | ✔ | informational only
| title  | ✔ | ✔ | informational only
| description  | ✔ | ✔ | informational only
| format | ✔ | ✔ |
| divisibleBy  | ✔ | ✔ |
| disallow | ✔ | ✔ |
| extends  | ✔ | ✔ |
| id | ✔ | ✔ | informational only
| $ref | ✔ | ✔ |
| $schema  | ✔ |   | ignored

### Types

| Value | JSON Schema Draft | jsonschema | Comments |
|:------|:-----------------:|:----------:|:---------|
| `string` | ✔ | ✔ |
| `number` | ✔ | ✔ |
| `integer` | ✔ | ✔ |
| `boolean` | ✔ | ✔ |
| `object` | ✔ | ✔ |
| `array` | ✔ | ✔ |
| `null` | ✔ | ✔ |
| `date` |   | ✔ |
| `any` | ✔ | ✔ |
|  Union Types | ✔ | ✔ |

### String Formats

| Value | JSON Schema Draft | jsonschema | Comments |
|:------|:-----------------:|:----------:|:---------|
| `date-time` | ✔ | ✔ |
| `date` | ✔ | ✔ |
| `time` | ✔ | ✔ |
| `utc-millisec` | ✔ | ✔ | Any number (integer or float) is allowed
| `regex` | ✔ | ✔ | We test for valid regular expression
| `color` | ✔ | ✔ |
| `style` | ✔ | ✔ |
| `phone` | ✔ | ✔ | Should follow [http://en.wikipedia.org/wiki/E.123](E.123) standard.
| `uri` | ✔ | ✔ |
| `email` | ✔ | ✔ |
| `ip-address` | ✔ | ✔ |
| `ipv6` | ✔ | ✔ |
| `host-name` | ✔ | ✔ |
| `alpha` |   | ✔ |
| `alphanumeric` |   | ✔ |

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
