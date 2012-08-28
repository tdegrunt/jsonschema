'use strict';

var validate = require('../lib/index').validate;

var instance = 4;
var schema = {"type": "number"};
console.log(validate(instance, schema));
