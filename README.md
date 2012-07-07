# jsonschema

Simple and fast [JSON schema](http://tools.ietf.org/html/draft-zyp-json-schema-03) validator

## Usage
```javascript
	var v = new Validator();
	var instance = 4;
	var schema = {"type": "number"};
	console.log(v.validate(instance, schema));
```

## Features

### Definitions

Any non ticked of definition types are ignored.

| Value | JSON Schema Draft | jsonschema | Comments |
|:------|:-----------------:|:----------:|:---------|
| type  | ✔ | ✔ |
| properties | ✔ | ✔ |
| patternProperties  | ✔ |   |
| additionalProperties | ✔ |   |
| items  | ✔ | ✔ |
| additionalItems  | ✔ |   |
| required | ✔ | ✔ |
| dependencies | ✔ |   |
| minimum  | ✔ | ✔ |
| maximum  | ✔ | ✔ |
| exclusiveMinimum | ✔ |   |
| exclusiveMaximum | ✔ |   |
| minItems | ✔ |   |
| maxItems | ✔ |   |
| uniqueItems  | ✔ |   |
| pattern  | ✔ |   |
| minLength  | ✔ |   |
| maxLength  | ✔ |   |
| enum | ✔ |   |
| default  | ✔ |   |
| title  | ✔ | ✔ | no function, only for commenting schema
| description  | ✔ | ✔ | no function, only for commenting schema
| format | ✔ |   |
| divisibleBy  | ✔ |   |
| disallow | ✔ |   |
| extends  | ✔ |   |
| id | ✔ | ✔ |
| $ref | ✔ | ✔ |
| $schema  | ✔ |  |

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
|  Union Types | ✔ | ✔ | Need tests for simple type and `$ref` combination