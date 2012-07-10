'use strict';

var util = require('util');
var Validator = require('../lib/validator');

var v = new Validator();
var instance = 4;
var schema = {"type": "number"};
console.log(v.validate(instance, schema));
