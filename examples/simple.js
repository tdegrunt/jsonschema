'use strict';

var util = require('util');
var Validator = require('jsonschema').Validator;

var v = new Validator();
var instance = 4;
var schema = {"type": "number"};
console.log(v.validate(instance, schema));
