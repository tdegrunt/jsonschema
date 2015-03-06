'use strict';

var util = require('util');
var Validator = require('jsonschema').Validator;

/*
  Translation/custom error mappings
*/
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
      'type': 'Array item must be an integer'
    },
    'instance.array2[3]': {
      'type': 'Array item 3 must be an integer'
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

var v = new Validator();
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

// English
console.log(v.validate(instance, schema).mapErrors(errorMap.en));

// French
console.log(v.validate(instance, schema).mapErrors(errorMap.fr));

// Custom error function
console.log(v.validate(instance, schema).mapErrors(function (err) {
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
