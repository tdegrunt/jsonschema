'use strict';

var Validator = require('jsonschema').Validator;

// This schema includes all of the possible validation tests.
var schema = {
  "id": "/All",
  "type": "object",
  "properties": {
    // --------------------------------------------------------------------
    // Type.
    // --------------------------------------------------------------------
    //
    // Validate that this property is of a specific type. Types are not the
    // standard set obtained from typeof, however. They are:
    //
    // string, number, integer, boolean, array, null, date, any, object.
    "validateType1": {
      "type": "string"
    },
    // Note that multiple type options can be provided in an array.
    "validateType2": {
      "type": ["boolean", "string"]
    },
    // It is also possible to specify forbidden types, either using "not" or
    // "disallow", either of which can accept a string type name or array of
    // string type names.
    "validateType3": {
      "not": "string",
    },
    "validateType4": {
      "disallow": ["boolean", "string"]
    },

    // --------------------------------------------------------------------
    // Object Properties.
    // --------------------------------------------------------------------
    //
    // Describing properties is the way in which a schema for nested objects can
    // be constructed.
    //
    // Firstly any number of object properties can be described one by one, by
    // name, and given validation rules.
    "validateProperties": {
      "type": "object",
      "properties": {
        "a": {
          "type": "array"
        },
        "b": {
          "type": "integer"
        }
      }
    },
    // Secondly, regular expression strings can be used to describe validation
    // of properties.
    "validatePatternProperties": {
      "type": "object",
      "patternProperties": {
        // The property name will be passed to new RegExp(prop), so backslashes
        // have to be escaped.
        "^x1\\d*$": {
          "type": "array"
        },
        "^[a-z]+$": {
          "type": "integer"
        }
      }
    },
    // A catch-all additionalProperties validation is applied to every property
    // not defined explicitly or matched by a pattern.
    "validateAdditionalProperties1": {
      "type": "object",
      "properties": {
        "a": {
          "type": "array"
        }
      },
      "patternProperties": {
        "[b-z]+": {
          "type": "integer"
        }
      },
      "additionalProperties": {
        "type": "boolean"
      }
    },
    // If additionalProperties is set false then the presence of any properties
    // other than those specified will fail validation.
    "validateAdditionalProperties2": {
      "type": "object",
      "properties": {
        "a": {
          "type": "array"
        }
      },
      "patternProperties": {
        "[b-z]+": {
          "type": "integer"
        }
      },
      "additionalProperties": false
    },
    // The number of properties present on the object can also be validated.
    "validateNumberOfProperties": {
      "type": "object",
      "patternProperties": {
        "[a-z]+": {
          "type": "string"
        }
      },
      "minProperties": 1,
      "maxProperties": 2
    },

    // --------------------------------------------------------------------
    // Required.
    // --------------------------------------------------------------------
    //
    // All schema validation is optional unless defined to be required. In
    // other words, a value of undefined will pass validation.
    //
    // In this simple case, any value other than undefined is acceptable.
    "validateRequired": {
      "type": "any",
      "required": true
    },
    // For objects, it is also possible to list property names that are
    // required. This can be done in two ways, shown below:
    "validateRequiredProperties1": {
      "type": "object",
      "required": [
        "propA",
        "propB"
      ]
    },
    "validateRequiredProperties2": {
      "type": "object",
      "properties": {
        "propA": {
          "required": true
        },
        "propB": {
          "required": true
        }
      }
    },

    // --------------------------------------------------------------------
    // Arrays.
    // --------------------------------------------------------------------
    //
    // The elements of an array can be validated to match any schema definition,
    // either simple or as complex and nested as desired.
    "validateItems": {
      "type": "array",
      // A simple schema for the items in this array, only specifying type.
      "items": {
        "type": "string"
      }
    },
    // The size of the array can also be validated.
    "validateNumberOfItems": {
      "type": "array",
      "minItems": 1,
      "maxItems": 2
    },
    // If the uniqueItems property is defined with any value, then validation
    // fails if any of the items in the array pass a strict equality test.
    "validateUniqueItems": {
      "type": "array",
      "uniqueItems": true
    },

    // --------------------------------------------------------------------
    // Numbers.
    // --------------------------------------------------------------------
    //
    // Number and integer types can be validated in a number of ways:
    "validateNumber": {
      "type": ["number"],
      "minimum": 0,
      "maximum": 10,
      // Beware floating point errors!
      "divisibleBy": 2.4,
      "multipleOf": 4.8
    },
    // A few of the options are more applicable to integers:
    "validateInteger": {
      "type": ["integer"],
      // Only even numbers pass validation.
      "divisibleBy": 2,
      "multipleOf": 4
    },

    // --------------------------------------------------------------------
    // Strings.
    // --------------------------------------------------------------------
    //
    // Match against a substring or regular expression.
    "validatePattern1": {
      "type": "string",
      "pattern": "str"
    },
    "validatePattern2": {
      "type": "string",
      "pattern": /str/
    },
    // The format validation option provides shortcuts for various regular
    // expressions or functions that check specific string formats. The
    // available formats are:
    //
    // date-time, date, time, ip-address, ipv6, uri, color, host-name, alpha,
    // alpha-numeric, utc-millisec
    "validateFormat": {
      "type": "string",
      // This validates against possible values for color in CSS.
      "format": "color"
    },
    // String length can be validated.
    "validateLength": {
      "type": "string",
      "minLength": 1,
      "maxLength": 2
    },

    // --------------------------------------------------------------------
    // Enumerated values.
    // --------------------------------------------------------------------
    //
    // Validation passes if the property is strictly equal to one of the
    // enumerated values.
    "validateEnum": {
      "enum": [
        "value",
        {
          "x": 11
        }
      ]
    },

    // --------------------------------------------------------------------
    // Dependencies.
    // --------------------------------------------------------------------
    //
    // It is possible to declare a property in an object to require the presence
    // of one or more other properties.
    //
    // In this case neither "a" nor "b" are defined as required, but if "a" is
    // present, then "b" must also be present.
    "validateDependencies1": {
      "type": "object",
      "properties": {
        "a": {
          "type": "string",
        },
        "b": {
          "type": "boolean"
        }
      },
      "dependencies": {
        "a": "b"
      }
    },
    // Multiple dependencies can be defined for any one property. Here again
    // none of the properties are defined as being required, but if "a" is
    // present then "b" and "c" must also be present.
    "validateDependencies2": {
      "type": "object",
      "properties": {
        "a": {
          "type": "string",
        },
        "b": {
          "type": "boolean"
        },
        "c": {
          "type": "number"
        }
      },
      "dependencies": {
        "a": ["b", "c"]
      }
    },

    // --------------------------------------------------------------------
    // Schema matching options.
    // --------------------------------------------------------------------
    //
    // There are a number of options for validating against more than one
    // schema: one of, any of, all of.
    //
    // The property must match one or more of the validation schema provided in
    // the array, which can be as simple or complex and nested as desired.
    "validateAnyOf": { "anyOf" : [
      {
        "type": "boolean"
      },
      {
        "type": "string"
      }
    ]},
    // The property must match all of the validation schema provided in the
    // array, which can be as simple or complex and nested as desired.
    "validateAllOf": { "allOf" : [
      {
        "type": "boolean"
      },
      {
        "enum": [true]
      }
    ]},
    // The property must match only one of the validation schema provided in the
    // array, which can be as simple or complex and nested as desired.
    "validateOneOf": { "oneOf" : [
      {
        "type": "boolean"
      },
      {
        "type": "integer"
      }
    ]},

    // --------------------------------------------------------------------
    // References.
    // --------------------------------------------------------------------
    //
    // One schema definition can reference other schema definitions, which
    // allows easier construction of more complex schemas by reusing their
    // common component parts.
    "validateReference": {
      // The /ReferencedSchema is defined below in the referencedSchema
      // variable. It must be registered with the validator prior to validation
      // using the addSchema method. See below for that as well.
      "$ref": "/ReferencedSchema"
    }
  }
};

// An example of a smaller schema referenced from the main schema definition.
// This is about as simple as a schema can possibly be - most are more complex,
// describing common collections of data such as addresses or database rows.
var referencedSchema = {
  "id": "/ReferencedSchema",
  "type": "string"
};

var all = {
  "validateType1": "a string",
  "validateType2": true,
  "validateType3": 6,
  "validateType4": 6,
  "validateProperties": {
    "a": [],
    "b": 6
  },
  "validatePatternProperties": {
    "x11": [],
    "abc": 5
  },
  "validateAdditionalProperties1": {
    "a": [],
    "bcd": 4,
    "11": true
  },
  "validateAdditionalProperties2": {
    "a": [],
    "bcd": 4
  },
  "validateNumberOfProperties": {
    "abc": "a string"
  },
  "validateRequired": 6,
  "validateRequiredProperties1": {
    "propA": 6,
    "propB": "a string"
  },
  "validateRequiredProperties2": {
    "propA": 6,
    "propB": "a string"
  },
  "validateItems": [
    "str-a",
    "str-b"
  ],
  "validateNumberOfItems": [
    "str-a"
  ],
  "validateUniqueItems": [
    "str-a",
    "str-b"
  ],
  "validateNumber": 9.6,
  "validateInteger": 8,
  "validatePattern1": "a string",
  "validatePattern2": "a string",
  "validateFormat": "blue",
  "validateLength": "a",
  "validateEnum": {
    "x": 11
  },
  "validateDependencies1": {
    "a": "a string",
    "b": true
  },
  "validateDependencies2": {
    "a": "a string",
    "b": true,
    "c": 8
  },
  "validateAnyOf": "a string",
  "validateAllOf": true,
  "validateOneOf": 6,
  "validateReference": "a string"
};

var v = new Validator();
v.addSchema(referencedSchema, '/ReferencedSchema');
console.log(v.validate(all, schema));
