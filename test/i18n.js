'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var Validator = require('../lib/validator');
var should = require('chai').should();

describe('i18n', function () {
  beforeEach(function () {
    this.validator = new Validator();
  });

  it('should override message from previous mapErrors if defined', function () {
    var r = this.validator.validate({
      a: 'not-number',
      b: 'not-number'
    }, {
      'type': 'object',
      'properties': {
        a: { 'type': 'number'},
        b: { 'type': 'number'}
      }
    }).mapErrors({ 'instance.a': 'Custom error message A' })
      .mapErrors({
        'instance.a': 'Custom error message A2',
        'instance.b': 'Custom error message B'
      });

    r.errors[0].message.should.equal('Custom error message A2');
    r.errors[1].message.should.equal('Custom error message B');
  });

  it('should keep existing message from previous mapErrors if not defined', function () {
    var r = this.validator.validate({
      a: 'not-number',
      b: 'not-number'
    }, {
      'type': 'object',
      'properties': {
        a: { 'type': 'number'},
        b: { 'type': 'number'}
      }
    }).mapErrors({ 'instance.a': 'Custom error message A' })
      .mapErrors({ 'instance.b': 'Custom error message B' });

    r.errors[0].message.should.equal('Custom error message A');
    r.errors[1].message.should.equal('Custom error message B');
  });

  describe('attributes', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    describe('type', function () {

      it('should handle multiple types', function () {
        //NOTE: Not sure this is the correct way to handle this scenario...
        this.validator.validate('not-number', { type: ['number', 'null'] }).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].validatorSubType.should.equal('null,number');
      });

      describe('number', function () {

        it('should provide custom error message for property', function () {
          this.validator.validate('not-number', {'type': 'number'}).mapErrors({
            'instance': 'Custom error message'
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide custom error message for validator type', function () {
          this.validator.validate('not-number', {'type': 'number'}).mapErrors({
            'instance': {
              'type': 'Custom error message'
            }
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide custom error message for validator sub-type', function () {
          this.validator.validate('not-number', {'type': 'number'}).mapErrors({
            'instance': {
              'type': {
                'number': 'Custom error message'
              }
            }
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide a validator type', function () {
          this.validator.validate('not-number', {'type': 'number'}).mapErrors({
          }).errors[0].validatorType.should.equal('type');
        });

        it('should provide a validator sub-type', function () {
          this.validator.validate('not-number', {'type': 'number'}).mapErrors({
          }).errors[0].validatorSubType.should.equal('number');
        });

      });

      describe('required', function () {

        it('should provide custom error message for property', function () {
          this.validator.validate(undefined, {'type': 'number', 'required': true}).mapErrors({
            'instance': 'Custom error message'
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide custom error message for validator type', function () {
          this.validator.validate(undefined, {'type': 'number', 'required': true}).mapErrors({
            'instance': {
              'required': 'Custom error message'
            }
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide a validator type', function () {
          this.validator.validate(undefined, {'type': 'number', 'required': true}).mapErrors({
          }).errors[0].validatorType.should.equal('required');
        });

        it('should not provide a validator sub-type', function () {
          should.not.exist(this.validator.validate(undefined, {'type': 'number', 'required': true}).mapErrors({
          }).errors[0].validatorSubType);
        });

      });

      describe('null', function () {

        it('should provide custom error message for property', function () {
          this.validator.validate('0', {'type': 'null'}).mapErrors({
            'instance': 'Custom error message'
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide custom error message for validator type', function () {
          this.validator.validate('0', {'type': 'null'}).mapErrors({
            'instance': {
              'type': 'Custom error message'
            }
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide custom error message for validator sub-type', function () {
          this.validator.validate('0', {'type': 'null'}).mapErrors({
            'instance': {
              'type': {
                'null': 'Custom error message'
              }
            }
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide a validator type', function () {
          this.validator.validate('0', {'type': 'null'}).mapErrors({
          }).errors[0].validatorType.should.equal('type');
        });

        it('should provide a validator sub-type', function () {
          this.validator.validate('0', {'type': 'null'}).mapErrors({
          }).errors[0].validatorSubType.should.equal('null');
        });

      });

      describe('date', function () {

        it('should provide custom error message for property', function () {
          this.validator.validate('0', {'type': 'date'}).mapErrors({
            'instance': 'Custom error message'
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide custom error message for validator type', function () {
          this.validator.validate('0', {'type': 'date'}).mapErrors({
            'instance': {
              'type': 'Custom error message'
            }
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide custom error message for validator sub-type', function () {
          this.validator.validate('0', {'type': 'date'}).mapErrors({
            'instance': {
              'type': {
                'date': 'Custom error message'
              }
            }
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide a validator type', function () {
          this.validator.validate('0', {'type': 'date'}).mapErrors({
          }).errors[0].validatorType.should.equal('type');
        });

        it('should provide a validator sub-type', function () {
          this.validator.validate('0', {'type': 'date'}).mapErrors({
          }).errors[0].validatorSubType.should.equal('date');
        });

      });

      describe('integer', function () {

        it('should provide custom error message for property', function () {
          this.validator.validate(0.25, {'type': 'integer'}).mapErrors({
            'instance': 'Custom error message'
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide custom error message for validator type', function () {
          this.validator.validate(0.25, {'type': 'integer'}).mapErrors({
            'instance': {
              'type': 'Custom error message'
            }
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide custom error message for validator sub-type', function () {
          this.validator.validate(0.25, {'type': 'integer'}).mapErrors({
            'instance': {
              'type': {
                'integer': 'Custom error message'
              }
            }
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide a validator type', function () {
          this.validator.validate(0.25, {'type': 'integer'}).mapErrors({
          }).errors[0].validatorType.should.equal('type');
        });

        it('should provide a validator sub-type', function () {
          this.validator.validate(0.25, {'type': 'integer'}).mapErrors({
          }).errors[0].validatorSubType.should.equal('integer');
        });

      });

      describe('boolean', function () {

        it('should provide custom error message for property', function () {
          this.validator.validate('true', {'type': 'boolean'}).mapErrors({
            'instance': 'Custom error message'
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide custom error message for validator type', function () {
          this.validator.validate('true', {'type': 'boolean'}).mapErrors({
            'instance': {
              'type': 'Custom error message'
            }
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide custom error message for validator sub-type', function () {
          this.validator.validate('true', {'type': 'boolean'}).mapErrors({
            'instance': {
              'type': {
                'boolean': 'Custom error message'
              }
            }
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide a validator type', function () {
          this.validator.validate('true', {'type': 'boolean'}).mapErrors({
          }).errors[0].validatorType.should.equal('type');
        });

        it('should provide a validator sub-type', function () {
          this.validator.validate('true', {'type': 'boolean'}).mapErrors({
          }).errors[0].validatorSubType.should.equal('boolean');
        });

      });

      describe('any', function () {

        //NOTE: Because any will let through everything, the custom message must go on the required attribute

        it('should provide custom error message for property', function () {
          this.validator.validate(undefined, {'type': 'any', required: true}).mapErrors({
            'instance': 'Custom error message'
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide custom error message for validator type', function () {
          this.validator.validate(undefined, {'type': 'any', required: true}).mapErrors({
            'instance': {
              'required': 'Custom error message'
            }
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide a validator type', function () {
          this.validator.validate(undefined, {'type': 'any', required: true}).mapErrors({
          }).errors[0].validatorType.should.equal('required');
        });

        it('should not provide a validator sub-type', function () {
          should.not.exist(this.validator.validate(undefined, {'type': 'any', required: true}).mapErrors({
          }).errors[0].validatorSubType);
        });

      });
    });

    describe('minimum', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate(1, {'type': 'number', 'minimum': 2}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate(1, {'type': 'number', 'minimum': 2}).mapErrors({
          'instance': {
            'minimum': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate(1, {'type': 'number', 'minimum': 2}).mapErrors({
        }).errors[0].validatorType.should.equal('minimum');
      });

      it('should not provide a validator sub-type', function () {
        should.not.exist(this.validator.validate(1, {'type': 'number', 'minimum': 2}).mapErrors({
        }).errors[0].validatorSubType);
      });

      describe('exclusiveMinimum', function () {

        it('should provide custom error message for property', function () {
          this.validator.validate(1, {'type': 'number', 'minimum': 1, 'exclusiveMinimum': true}).mapErrors({
            'instance': 'Custom error message'
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide custom error message for validator type', function () {
          this.validator.validate(1, {'type': 'number', 'minimum': 1, 'exclusiveMinimum': true}).mapErrors({
            'instance': {
              'minimum': 'Custom error message'
            }
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide a validator type', function () {
          this.validator.validate(1, {'type': 'number', 'minimum': 1, 'exclusiveMinimum': true}).mapErrors({
          }).errors[0].validatorType.should.equal('minimum');
        });

        it('should not provide a validator sub-type', function () {
          should.not.exist(this.validator.validate(1, {'type': 'number', 'minimum': 1, 'exclusiveMinimum': true}).mapErrors({
          }).errors[0].validatorSubType);
        });

      });

    });

    describe('maximum', function () {
      it('should provide custom error message for property', function () {
        this.validator.validate(3, {'type': 'number', 'maximum': 2}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate(3, {'type': 'number', 'maximum': 2}).mapErrors({
          'instance': {
            'maximum': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate(3, {'type': 'number', 'maximum': 1}).mapErrors({
        }).errors[0].validatorType.should.equal('maximum');
      });

      it('should not provide a validator sub-type', function () {
        should.not.exist(this.validator.validate(3, {'type': 'number', 'maximum': 1}).mapErrors({
        }).errors[0].validatorSubType);
      });

      describe('exclusiveMaximum', function () {

        it('should provide custom error message for property', function () {
          this.validator.validate(2, {'type': 'number', 'maximum': 1, 'exclusiveMaximum': true}).mapErrors({
            'instance': 'Custom error message'
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide custom error message for validator type', function () {
          this.validator.validate(2, {'type': 'number', 'maximum': 1, 'exclusiveMaximum': true}).mapErrors({
            'instance': {
              'maximum': 'Custom error message'
            }
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide a validator type', function () {
          this.validator.validate(2, {'type': 'number', 'maximum': 1, 'exclusiveMaximum': true}).mapErrors({
          }).errors[0].validatorType.should.equal('maximum');
        });

        it('should not provide a validator sub-type', function () {
          should.not.exist(this.validator.validate(2, {'type': 'number', 'maximum': 1, 'exclusiveMaximum': true}).mapErrors({
          }).errors[0].validatorSubType);
        });

      });

    });

    describe('divisibleBy', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate(1, {'type': 'number', 'divisibleBy': 2}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate(1, {'type': 'number', 'divisibleBy': 2}).mapErrors({
          'instance': {
            'divisibleBy': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate(1, {'type': 'number', 'divisibleBy': 2}).mapErrors({
        }).errors[0].validatorType.should.equal('divisibleBy');
      });

      it('should not provide a validator sub-type', function () {
        should.not.exist(this.validator.validate(1, {'type': 'number', 'divisibleBy': 2}).mapErrors({
        }).errors[0].validatorSubType);
      });

    });

    describe('pattern', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate('abac', {'type': 'string', 'pattern': 'ab+c'}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate('abac', {'type': 'string', 'pattern': 'ab+c'}).mapErrors({
          'instance': {
            'pattern': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate('abac', {'type': 'string', 'pattern': 'ab+c'}).mapErrors({
        }).errors[0].validatorType.should.equal('pattern');
      });

      it('should not provide a validator sub-type', function () {
        should.not.exist(this.validator.validate('abac', {'type': 'string', 'pattern': 'ab+c'}).mapErrors({
        }).errors[0].validatorSubType);
      });

    });

    describe('minLength', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate('abcde', {'type': 'string', 'minLength': 6}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate('abcde', {'type': 'string', 'minLength': 6}).mapErrors({
          'instance': {
            'minLength': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate('abcde', {'type': 'string', 'minLength': 6}).mapErrors({
        }).errors[0].validatorType.should.equal('minLength');
      });

      it('should not provide a validator sub-type', function () {
        should.not.exist(this.validator.validate('abcde', {'type': 'string', 'minLength': 6}).mapErrors({
        }).errors[0].validatorSubType);
      });

    });

    describe('maxLength', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate('abcde', {'type': 'string', 'maxLength': 4}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate('abcde', {'type': 'string', 'maxLength': 4}).mapErrors({
          'instance': {
            'maxLength': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate('abcde', {'type': 'string', 'maxLength': 4}).mapErrors({
        }).errors[0].validatorType.should.equal('maxLength');
      });

      it('should not provide a validator sub-type', function () {
        should.not.exist(this.validator.validate('abcde', {'type': 'string', 'maxLength': 4}).mapErrors({
        }).errors[0].validatorSubType);
      });

    });

    describe('enum', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate('abcde', {'type': 'string', 'enum': ['abcdf', 'abcdd']}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate('abcde', {'type': 'string', 'enum': ['abcdf', 'abcdd']}).mapErrors({
          'instance': {
            'enum': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate('abcde', {'type': 'string', 'enum': ['abcdf', 'abcdd']}).mapErrors({
        }).errors[0].validatorType.should.equal('enum');
      });

      it('should not provide a validator sub-type', function () {
        should.not.exist(this.validator.validate('abcde', {'type': 'string', 'enum': ['abcdf', 'abcdd']}).mapErrors({
        }).errors[0].validatorSubType);
      });

    });

    describe('not', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate([1], {'type': 'any', 'not':'array'}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate([1], {'type': 'any', 'not':'array'}).mapErrors({
          'instance': {
            'not': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate([1], {'type': 'any', 'not':'array'}).mapErrors({
        }).errors[0].validatorType.should.equal('not');
      });

      it('should not provide a validator sub-type', function () {
        should.not.exist(this.validator.validate([1], {'type': 'any', 'not':'array'}).mapErrors({
        }).errors[0].validatorSubType);
      });

      it('should prohibit specified types', function () {
        this.validator.validate([1], {'type': 'any', 'not':'array'}).valid.should.be.false;
      });
    });

    describe('disallow', function () {

      //NOTE: 'disallow' is a depreciated alias for 'not', custom error message will always use 'not' field

      it('should provide custom error message for property', function () {
        this.validator.validate([1], {'type': 'any', 'disallow':'array'}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate([1], {'type': 'any', 'disallow':'array'}).mapErrors({
          'instance': {
            'not': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate([1], {'type': 'any', 'disallow':'array'}).mapErrors({
        }).errors[0].validatorType.should.equal('not');
      });

      it('should not provide a validator sub-type', function () {
        should.not.exist(this.validator.validate([1], {'type': 'any', 'disallow':'array'}).mapErrors({
        }).errors[0].validatorSubType);
      });

      it('should prohibit specified types', function () {
        this.validator.validate([1], {'type': 'any', 'disallow':'array'}).valid.should.be.false;
      });
    });

    describe('dependencies', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate({quux: 1, foo: 1}, {'dependencies': {'quux': ['foo', 'bar']}}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate({quux: 1, foo: 1}, {'dependencies': {'quux': ['foo', 'bar']}}).mapErrors({
          'instance': {
            'dependencies': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate({quux: 1, foo: 1}, {'dependencies': {'quux': ['foo', 'bar']}}).mapErrors({
        }).errors[0].validatorType.should.equal('dependencies');
      });

      it('should not provide a validator sub-type', function () {
        should.not.exist(this.validator.validate({quux: 1, foo: 1}, {'dependencies': {'quux': ['foo', 'bar']}}).mapErrors({
        }).errors[0].validatorSubType);
      });

    });
  });

  describe('Formats', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    describe('date-time', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate("2012-07-08", {'type': 'string', 'format': 'date-time'}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate("2012-07-08", {'type': 'string', 'format': 'date-time'}).mapErrors({
          'instance': {
            'format': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator sub-type', function () {
        this.validator.validate("2012-07-08", {'type': 'string', 'format': 'date-time'}).mapErrors({
          'instance': {
            'format': {
              'date-time': 'Custom error message'
            }
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate("2012-07-08", {'type': 'string', 'format': 'date-time'}).mapErrors({
        }).errors[0].validatorType.should.equal('format');
      });

      it('should provide a validator sub-type', function () {
        this.validator.validate("2012-07-08", {'type': 'string', 'format': 'date-time'}).mapErrors({
        }).errors[0].validatorSubType.should.equal('date-time');
      });

    });

    describe('date', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate("TEST2012-07-08", {'type': 'string', 'format': 'date'}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate("TEST2012-07-08", {'type': 'string', 'format': 'date'}).mapErrors({
          'instance': {
            'format': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator sub-type', function () {
        this.validator.validate("TEST2012-07-08", {'type': 'string', 'format': 'date'}).mapErrors({
          'instance': {
            'format': {
              'date': 'Custom error message'
            }
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate("TEST2012-07-08", {'type': 'string', 'format': 'date'}).mapErrors({
        }).errors[0].validatorType.should.equal('format');
      });

      it('should provide a validator sub-type', function () {
        this.validator.validate("TEST2012-07-08", {'type': 'string', 'format': 'date'}).mapErrors({
        }).errors[0].validatorSubType.should.equal('date');
      });

    });

    describe('time', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate("16:41:41.532Z", {'type': 'string', 'format': 'time'}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate("16:41:41.532Z", {'type': 'string', 'format': 'time'}).mapErrors({
          'instance': {
            'format': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator sub-type', function () {
        this.validator.validate("16:41:41.532Z", {'type': 'string', 'format': 'time'}).mapErrors({
          'instance': {
            'format': {
              'time': 'Custom error message'
            }
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate("16:41:41.532Z", {'type': 'string', 'format': 'time'}).mapErrors({
        }).errors[0].validatorType.should.equal('format');
      });

      it('should provide a validator sub-type', function () {
        this.validator.validate("16:41:41.532Z", {'type': 'string', 'format': 'time'}).mapErrors({
        }).errors[0].validatorSubType.should.equal('time');
      });

    });

    describe('utc-millisec', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate("16:41:41.532Z", {'type': 'string', 'format': 'utc-millisec'}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate("16:41:41.532Z", {'type': 'string', 'format': 'utc-millisec'}).mapErrors({
          'instance': {
            'format': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator sub-type', function () {
        this.validator.validate("16:41:41.532Z", {'type': 'string', 'format': 'utc-millisec'}).mapErrors({
          'instance': {
            'format': {
              'utc-millisec': 'Custom error message'
            }
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate("16:41:41.532Z", {'type': 'string', 'format': 'utc-millisec'}).mapErrors({
        }).errors[0].validatorType.should.equal('format');
      });

      it('should provide a validator sub-type', function () {
        this.validator.validate("16:41:41.532Z", {'type': 'string', 'format': 'utc-millisec'}).mapErrors({
        }).errors[0].validatorSubType.should.equal('utc-millisec');
      });

    });

    describe('regex', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate("/^(abc]/", {'type': 'string', 'format': 'regex'}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate("/^(abc]/", {'type': 'string', 'format': 'regex'}).mapErrors({
          'instance': {
            'format': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator sub-type', function () {
        this.validator.validate("/^(abc]/", {'type': 'string', 'format': 'regex'}).mapErrors({
          'instance': {
            'format': {
              'regex': 'Custom error message'
            }
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate("/^(abc]/", {'type': 'string', 'format': 'regex'}).mapErrors({
        }).errors[0].validatorType.should.equal('format');
      });

      it('should provide a validator sub-type', function () {
        this.validator.validate("/^(abc]/", {'type': 'string', 'format': 'regex'}).mapErrors({
        }).errors[0].validatorSubType.should.equal('regex');
      });

    });

    describe('color', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate("json", {'type': 'string', 'format': 'color'}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate("json", {'type': 'string', 'format': 'color'}).mapErrors({
          'instance': {
            'format': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator sub-type', function () {
        this.validator.validate("json", {'type': 'string', 'format': 'color'}).mapErrors({
          'instance': {
            'format': {
              'color': 'Custom error message'
            }
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate("json", {'type': 'string', 'format': 'color'}).mapErrors({
        }).errors[0].validatorType.should.equal('format');
      });

      it('should provide a validator sub-type', function () {
        this.validator.validate("json", {'type': 'string', 'format': 'color'}).mapErrors({
        }).errors[0].validatorSubType.should.equal('color');
      });

    });

    describe('style', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate("0", {'type': 'string', 'format': 'style'}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate("0", {'type': 'string', 'format': 'style'}).mapErrors({
          'instance': {
            'format': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator sub-type', function () {
        this.validator.validate("0", {'type': 'string', 'format': 'style'}).mapErrors({
          'instance': {
            'format': {
              'style': 'Custom error message'
            }
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate("0", {'type': 'string', 'format': 'style'}).mapErrors({
        }).errors[0].validatorType.should.equal('format');
      });

      it('should provide a validator sub-type', function () {
        this.validator.validate("0", {'type': 'string', 'format': 'style'}).mapErrors({
        }).errors[0].validatorSubType.should.equal('style');
      });

    });

    describe('phone', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate("31 42 123 4567", {'type': 'string', 'format': 'phone'}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate("31 42 123 4567", {'type': 'string', 'format': 'phone'}).mapErrors({
          'instance': {
            'format': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator sub-type', function () {
        this.validator.validate("31 42 123 4567", {'type': 'string', 'format': 'phone'}).mapErrors({
          'instance': {
            'format': {
              'phone': 'Custom error message'
            }
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate("31 42 123 4567", {'type': 'string', 'format': 'phone'}).mapErrors({
        }).errors[0].validatorType.should.equal('format');
      });

      it('should provide a validator sub-type', function () {
        this.validator.validate("31 42 123 4567", {'type': 'string', 'format': 'phone'}).mapErrors({
        }).errors[0].validatorSubType.should.equal('phone');
      });

    });

    describe('uri', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate("tdegrunt", {'type': 'string', 'format': 'uri'}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate("tdegrunt", {'type': 'string', 'format': 'uri'}).mapErrors({
          'instance': {
            'format': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator sub-type', function () {
        this.validator.validate("tdegrunt", {'type': 'string', 'format': 'uri'}).mapErrors({
          'instance': {
            'format': {
              'uri': 'Custom error message'
            }
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate("tdegrunt", {'type': 'string', 'format': 'uri'}).mapErrors({
        }).errors[0].validatorType.should.equal('format');
      });

      it('should provide a validator sub-type', function () {
        this.validator.validate("tdegrunt", {'type': 'string', 'format': 'uri'}).mapErrors({
        }).errors[0].validatorSubType.should.equal('uri');
      });

    });

    describe('email', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate("obama@", {'type': 'string', 'format': 'email'}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate("obama@", {'type': 'string', 'format': 'email'}).mapErrors({
          'instance': {
            'format': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator sub-type', function () {
        this.validator.validate("obama@", {'type': 'string', 'format': 'email'}).mapErrors({
          'instance': {
            'format': {
              'email': 'Custom error message'
            }
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate("obama@", {'type': 'string', 'format': 'email'}).mapErrors({
        }).errors[0].validatorType.should.equal('format');
      });

      it('should provide a validator sub-type', function () {
        this.validator.validate("obama@", {'type': 'string', 'format': 'email'}).mapErrors({
        }).errors[0].validatorSubType.should.equal('email');
      });

    });

    describe('ip-address', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate("192.168.0", {'type': 'string', 'format': 'ip-address'}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate("192.168.0", {'type': 'string', 'format': 'ip-address'}).mapErrors({
          'instance': {
            'format': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator sub-type', function () {
        this.validator.validate("192.168.0", {'type': 'string', 'format': 'ip-address'}).mapErrors({
          'instance': {
            'format': {
              'ip-address': 'Custom error message'
            }
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate("192.168.0", {'type': 'string', 'format': 'ip-address'}).mapErrors({
        }).errors[0].validatorType.should.equal('format');
      });

      it('should provide a validator sub-type', function () {
        this.validator.validate("192.168.0", {'type': 'string', 'format': 'ip-address'}).mapErrors({
        }).errors[0].validatorSubType.should.equal('ip-address');
      });

    });

    describe('ipv6', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate("127.0.0.1", {'type': 'string', 'format': 'ipv6'}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate("127.0.0.1", {'type': 'string', 'format': 'ipv6'}).mapErrors({
          'instance': {
            'format': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator sub-type', function () {
        this.validator.validate("127.0.0.1", {'type': 'string', 'format': 'ipv6'}).mapErrors({
          'instance': {
            'format': {
              'ipv6': 'Custom error message'
            }
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate("127.0.0.1", {'type': 'string', 'format': 'ipv6'}).mapErrors({
        }).errors[0].validatorType.should.equal('format');
      });

      it('should provide a validator sub-type', function () {
        this.validator.validate("127.0.0.1", {'type': 'string', 'format': 'ipv6'}).mapErrors({
        }).errors[0].validatorSubType.should.equal('ipv6');
      });

    });

    describe('host-name', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate("www.-hi-.com", {'type': 'string', 'format': 'host-name'}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate("www.-hi-.com", {'type': 'string', 'format': 'host-name'}).mapErrors({
          'instance': {
            'format': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator sub-type', function () {
        this.validator.validate("www.-hi-.com", {'type': 'string', 'format': 'host-name'}).mapErrors({
          'instance': {
            'format': {
              'host-name': 'Custom error message'
            }
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate("www.-hi-.com", {'type': 'string', 'format': 'host-name'}).mapErrors({
        }).errors[0].validatorType.should.equal('format');
      });

      it('should provide a validator sub-type', function () {
        this.validator.validate("www.-hi-.com", {'type': 'string', 'format': 'host-name'}).mapErrors({
        }).errors[0].validatorSubType.should.equal('host-name');
      });

    });


    describe('alpha', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate("www.-hi-.com", {'type': 'string', 'format': 'alpha'}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate("www.-hi-.com", {'type': 'string', 'format': 'alpha'}).mapErrors({
          'instance': {
            'format': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator sub-type', function () {
        this.validator.validate("www.-hi-.com", {'type': 'string', 'format': 'alpha'}).mapErrors({
          'instance': {
            'format': {
              'alpha': 'Custom error message'
            }
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate("www.-hi-.com", {'type': 'string', 'format': 'alpha'}).mapErrors({
        }).errors[0].validatorType.should.equal('format');
      });

      it('should provide a validator sub-type', function () {
        this.validator.validate("www.-hi-.com", {'type': 'string', 'format': 'alpha'}).mapErrors({
        }).errors[0].validatorSubType.should.equal('alpha');
      });

    });

    describe('alphanumeric', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate("1test!", {'type': 'string', 'format': 'alphanumeric'}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate("1test!", {'type': 'string', 'format': 'alphanumeric'}).mapErrors({
          'instance': {
            'format': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator sub-type', function () {
        this.validator.validate("1test!", {'type': 'string', 'format': 'alphanumeric'}).mapErrors({
          'instance': {
            'format': {
              'alphanumeric': 'Custom error message'
            }
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate("1test!", {'type': 'string', 'format': 'alphanumeric'}).mapErrors({
        }).errors[0].validatorType.should.equal('format');
      });

      it('should provide a validator sub-type', function () {
        this.validator.validate("1test!", {'type': 'string', 'format': 'alphanumeric'}).mapErrors({
        }).errors[0].validatorSubType.should.equal('alphanumeric');
      });

    });
  });

  describe('Arrays', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    describe('simple array', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate(0, {'type': 'array'}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate(0, {'type': 'array'}).mapErrors({
          'instance': {
            'type': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator sub-type', function () {
        this.validator.validate(0, {'type': 'array'}).mapErrors({
          'instance': {
            'type': {
              'array': 'Custom error message'
            }
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate(0, {'type': 'array'}).mapErrors({
        }).errors[0].validatorType.should.equal('type');
      });

      it('should provide a validator sub-type', function () {
        this.validator.validate(0, {'type': 'array'}).mapErrors({
        }).errors[0].validatorSubType.should.equal('array');
      });

      describe('attribute on array items', function () {
        it('should provide custom error message for property', function () {
          this.validator.validate(['1', '2', '3', 4], {'type': 'array', 'items': {'type': 'string'}}).mapErrors({
            'instance[]': 'Custom error message'
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide custom error message for validator type', function () {
          this.validator.validate(['1', '2', '3', 4], {'type': 'array', 'items': {'type': 'string'}}).mapErrors({
            'instance[]': {
              'type': 'Custom error message'
            }
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide custom error message for validator sub-type', function () {
          this.validator.validate(['1', '2', '3', 4], {'type': 'array', 'items': {'type': 'string'}}).mapErrors({
            'instance[]': {
              'type': {
                'string': 'Custom error message'
              }
            }
          }).errors[0].message.should.equal('Custom error message');
        });

        it('should provide a validator type', function () {
          this.validator.validate(['1', '2', '3', 4], {'type': 'array', 'items': {'type': 'string'}}).mapErrors({
          }).errors[0].validatorType.should.equal('type');
        });

        it('should provide a validator sub-type', function () {
          this.validator.validate(['1', '2', '3', 4], {'type': 'array', 'items': {'type': 'string'}}).mapErrors({
          }).errors[0].validatorSubType.should.equal('string');
        });

        it('should provide custom error message for specific array item', function () {
          var r = this.validator.validate(['1', 2, '3', 4], {'type': 'array', 'items': {'type': 'string'}}).mapErrors({
            'instance[]': 'Custom error message',
            'instance[3]': 'Item-specific custom error message'
          });
          r.errors[0].message.should.equal('Custom error message');
          r.errors[1].message.should.equal('Item-specific custom error message');
        });

      });

    });

    describe('minItems', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate([1], {'type': 'array', 'items': {'type': 'number'}, 'minItems': 2}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate([1], {'type': 'array', 'items': {'type': 'number'}, 'minItems': 2}).mapErrors({
          'instance': {
            'minItems': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate([1], {'type': 'array', 'items': {'type': 'number'}, 'minItems': 2}).mapErrors({
        }).errors[0].validatorType.should.equal('minItems');
      });

      it('should not provide a validator sub-type', function () {
        should.not.exist(this.validator.validate([1], {'type': 'array', 'items': {'type': 'number'}, 'minItems': 2}).mapErrors({
        }).errors[0].validatorSubType);
      });

    });

    describe('maxItems', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate([1, 2, 3], {'type': 'array', 'items': {'type': 'number'}, 'maxItems': 2}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate([1, 2, 3], {'type': 'array', 'items': {'type': 'number'}, 'maxItems': 2}).mapErrors({
          'instance': {
            'maxItems': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate([1, 2, 3], {'type': 'array', 'items': {'type': 'number'}, 'maxItems': 2}).mapErrors({
        }).errors[0].validatorType.should.equal('maxItems');
      });

      it('should not provide a validator sub-type', function () {
        should.not.exist(this.validator.validate([1, 2, 3], {'type': 'array', 'items': {'type': 'number'}, 'maxItems': 2}).mapErrors({
        }).errors[0].validatorSubType);
      });

    });

    describe('uniqueItems', function () {

      it('should provide custom error message for property', function () {
        this.validator.validate([1, 2, 4, 1, 3, 5], {'type': 'array', 'uniqueItems': true}).mapErrors({
          'instance': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate([1, 2, 4, 1, 3, 5], {'type': 'array', 'uniqueItems': true}).mapErrors({
          'instance': {
            'uniqueItems': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate([1, 2, 4, 1, 3, 5], {'type': 'array', 'uniqueItems': true}).mapErrors({
        }).errors[0].validatorType.should.equal('uniqueItems');
      });

      it('should not provide a validator sub-type', function () {
        should.not.exist(this.validator.validate([1, 2, 4, 1, 3, 5], {'type': 'array', 'uniqueItems': true}).mapErrors({
        }).errors[0].validatorSubType);
      });

    });
  });

  describe('Mixed', function () {
    beforeEach(function () {
      this.validator = new Validator();
      this.mixedSchema = {
        'type': 'object',
        'properties': {
          'name': {'type': 'string'},
          'lines': {
            'type': 'array',
            'items': {'type': 'string'}
          }
        }
      };
    });

    describe('simple object with array with invalid items', function () {
      it('should provide custom error message for property', function () {
        this.validator.validate({'name':'test', 'lines': [1]},this.mixedSchema).mapErrors({
          'instance.lines[]': 'Custom error message'
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator type', function () {
        this.validator.validate({'name':'test', 'lines': [1]},this.mixedSchema).mapErrors({
          'instance.lines[]': {
            'type': 'Custom error message'
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide custom error message for validator sub-type', function () {
        this.validator.validate({'name':'test', 'lines': [1]},this.mixedSchema).mapErrors({
          'instance.lines[]': {
            'type': {
              'string': 'Custom error message'
            }
          }
        }).errors[0].message.should.equal('Custom error message');
      });

      it('should provide a validator type', function () {
        this.validator.validate({'name':'test', 'lines': [1]},this.mixedSchema).mapErrors({
          'instance.lines[]': {
            'type': {
              'string': 'Custom error message'
            }
          }
        }).errors[0].validatorType.should.equal('type');
      });

      it('should provide a validator sub-type', function () {
        this.validator.validate({'name':'test', 'lines': [1]},this.mixedSchema).mapErrors({
          'instance.lines[]': {
            'type': {
              'string': 'Custom error message'
            }
          }
        }).errors[0].validatorSubType.should.equal('string');
      });
    });
  });

});
