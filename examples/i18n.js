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


