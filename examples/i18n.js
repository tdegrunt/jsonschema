'use strict';

var util = require('util');
var Validator = require('jsonschema').Validator;

/*
  Default locale for errors
*/
var DEFAULT_ERROR_LOCALE = 'en';

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
console.log(i18n(v.validate(instance, schema), errorMap));
console.log(i18n(v.validate(instance, schema), errorMap, 'fr'));

/**
  Provides custom error messages or localises a validation result
 */
function i18n(result, errorMap, locale) {
  locale = locale || DEFAULT_ERROR_LOCALE;
  var map = errorMap[locale];
  if (!map) throw new Error('Missing error map for locale: ' + locale);

  // Only process results which have failed validation
  if (!result.valid && result.errors) {
    result.errors = result.errors.map(function (err) {
      return mapError(map, err);
    });
  }
  return result;
}

/**
  Maps a validation error to a custom error
*/
function mapError(map, err) {
  if (!err) return err;

  // Get the property path, validator type and validator sub-type from the error
  var propPath = err.property;
  var validatorType = err.validatorType;
  var validatorSubType = err.validatorSubType;

  // Check for a custom error for the property path
  var msgProp = map[propPath];
  if (!msgProp) {
    // No custom message
    return err;
  }
  if (typeof msgProp === 'string') {
    // Only a single message for this property
    err.message = msgProp;
    return err;
  }

  // Check for a custom error for the validator type
  var valProp = validatorType ? msgProp[validatorType] : null;
  if (!valProp) {
    // No custom validator message
    err.message = msgProp.message || err.message;
    return err;
  }
  if (typeof valProp === 'string') {
    // Only a single message for this validator
    err.message = valProp;
    return err;
  }

  // Check for a custom error for the validator sub-type
  var subValProp = validatorSubType ? valProp[validatorSubType] : null;
  if (!subValProp) {
    err.message = valProp.message || err.message;
    return err;
  }

  err.message = subValProp;
  return err;
}
