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
    }
  }
};
var instance = {
  noCustomMessage: 'not-an-int',
  customPropertyMessage: 'not-an-int',
  customValidatorTypeMessage: 2, // Below minimum
  customValidatorSubTypeMessage: 'not-an-IP-address'
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
