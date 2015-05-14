'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var Validator = require('../lib/validator');
var should = require('chai').should();

describe('i18n', function () {
  beforeEach(function () {
    this.validator = new Validator();
  });

  describe('attributes', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    describe('type', function () {

      describe('number', function () {

        it('should provide an error name', function () {
          this.validator.validate('not-number', {'type': 'number'})
            .errors[0].name.should.equal('type');
        });

        it('should provide an error argument', function () {
          should.exist(this.validator.validate('not-number', {'type': 'number'})
            .errors[0].argument);
        });

      });

      describe('required', function () {

        it('should provide an error name', function () {
          this.validator.validate(undefined, {'type': 'number', 'required': true})
            .errors[0].name.should.equal('required');
        });

      });

      describe('null', function () {

        it('should provide an error name', function () {
          this.validator.validate('0', {'type': 'null'})
            .errors[0].name.should.equal('type');
        });

      });

      describe('date', function () {

        it('should provide an error name', function () {
          this.validator.validate('0', {'type': 'date'})
            .errors[0].name.should.equal('type');
        });

        it('should provide an error argument', function () {
          should.exist(this.validator.validate('0', {'type': 'date'})
            .errors[0].argument);
        });

      });

      describe('integer', function () {

        it('should provide an error name', function () {
          this.validator.validate(0.25, {'type': 'integer'})
            .errors[0].name.should.equal('type');
        });

        it('should provide an error argument', function () {
          should.exist(this.validator.validate(0.25, {'type': 'integer'})
            .errors[0].argument);
        });

      });

      describe('boolean', function () {

        it('should provide an error name', function () {
          this.validator.validate('true', {'type': 'boolean'})
            .errors[0].name.should.equal('type');
        });

        it('should provide an error argument', function () {
          should.exist(this.validator.validate('true', {'type': 'boolean'})
            .errors[0].argument);
        });

      });

      describe('any', function () {

        //NOTE: Because any will let through everything, the custom message must go on the required attribute

        it('should provide an error name', function () {
          this.validator.validate(undefined, {'type': 'any', required: true})
            .errors[0].name.should.equal('required');
        });

      });
    });

    describe('minimum', function () {

      it('should provide an error name', function () {
        this.validator.validate(1, {'type': 'number', 'minimum': 2})
            .errors[0].name.should.equal('minimum');
      });

      it('should provide an error argument', function () {
        should.exist(this.validator.validate(1, {'type': 'number', 'minimum': 2})
            .errors[0].argument);
      });

      describe('exclusiveMinimum', function () {

        it('should provide an error name', function () {
          this.validator.validate(1, {'type': 'number', 'minimum': 1, 'exclusiveMinimum': true})
            .errors[0].name.should.equal('minimum');
        });

        it('should provide an error argument', function () {
          should.exist(this.validator.validate(1, {'type': 'number', 'minimum': 1, 'exclusiveMinimum': true})
            .errors[0].argument);
        });

      });

    });

    describe('maximum', function () {

      it('should provide an error name', function () {
        this.validator.validate(3, {'type': 'number', 'maximum': 1})
            .errors[0].name.should.equal('maximum');
      });

      it('should provide an error argument', function () {
        should.exist(this.validator.validate(3, {'type': 'number', 'maximum': 1})
            .errors[0].argument);
      });

      describe('exclusiveMaximum', function () {

        it('should provide an error name', function () {
          this.validator.validate(2, {'type': 'number', 'maximum': 1, 'exclusiveMaximum': true})
            .errors[0].name.should.equal('maximum');
        });

        it('should provide an error argument', function () {
          should.exist(this.validator.validate(2, {'type': 'number', 'maximum': 1, 'exclusiveMaximum': true})
            .errors[0].argument);
        });

      });

    });

    describe('divisibleBy', function () {

      it('should provide an error name', function () {
        this.validator.validate(1, {'type': 'number', 'divisibleBy': 2})
            .errors[0].name.should.equal('divisibleBy');
      });

      it('should provide an error argument', function () {
        should.exist(this.validator.validate(1, {'type': 'number', 'divisibleBy': 2})
            .errors[0].argument);
      });

    });

    describe('pattern', function () {

      it('should provide an error name', function () {
        this.validator.validate('abac', {'type': 'string', 'pattern': 'ab+c'})
            .errors[0].name.should.equal('pattern');
      });

      it('should provide an error argument', function () {
        should.exist(this.validator.validate('abac', {'type': 'string', 'pattern': 'ab+c'})
            .errors[0].argument);
      });

    });

    describe('minLength', function () {

      it('should provide an error name', function () {
        this.validator.validate('abcde', {'type': 'string', 'minLength': 6})
            .errors[0].name.should.equal('minLength');
      });

      it('should provide an error argument', function () {
        should.exist(this.validator.validate('abcde', {'type': 'string', 'minLength': 6})
            .errors[0].argument);
      });

    });

    describe('maxLength', function () {

      it('should provide an error name', function () {
        this.validator.validate('abcde', {'type': 'string', 'maxLength': 4})
            .errors[0].name.should.equal('maxLength');
      });

      it('should provide an error argument', function () {
        should.exist(this.validator.validate('abcde', {'type': 'string', 'maxLength': 4})
            .errors[0].argument);
      });

    });

    describe('enum', function () {

      it('should provide an error name', function () {
        this.validator.validate('abcde', {'type': 'string', 'enum': ['abcdf', 'abcdd']})
            .errors[0].name.should.equal('enum');
      });

      it('should provide an error argument', function () {
        should.exist(this.validator.validate('abcde', {'type': 'string', 'enum': ['abcdf', 'abcdd']})
            .errors[0].argument);
      });

    });

    describe('not', function () {

      it('should provide an error name', function () {
        this.validator.validate([1], {'type': 'any', 'not':'array'})
            .errors[0].name.should.equal('not');
      });

      it('should provide an error argument', function () {
        should.exist(this.validator.validate([1], {'type': 'any', 'not':'array'})
            .errors[0].argument);
      });

      it('should prohibit specified types', function () {
        this.validator.validate([1], {'type': 'any', 'not':'array'}).valid.should.be.false;
      });
    });

    describe('disallow', function () {

      //NOTE: 'disallow' is a depreciated alias for 'not', custom error message will always use 'not' field

      it('should provide an error name', function () {
        this.validator.validate([1], {'type': 'any', 'disallow':'array'})
            .errors[0].name.should.equal('not');
      });

      it('should provide an error argument', function () {
        should.exist(this.validator.validate([1], {'type': 'any', 'disallow':'array'})
            .errors[0].argument);
      });

      it('should prohibit specified types', function () {
        this.validator.validate([1], {'type': 'any', 'disallow':'array'}).valid.should.be.false;
      });
    });

    describe('dependencies', function () {

      it('should provide an error name', function () {
        this.validator.validate({quux: 1, foo: 1}, {'dependencies': {'quux': ['foo', 'bar']}})
            .errors[0].name.should.equal('dependencies');
      });

      it('should provide an error argument', function () {
        should.exist(this.validator.validate({quux: 1, foo: 1}, {'dependencies': {'quux': ['foo', 'bar']}})
            .errors[0].argument);
      });

    });
  });

  describe('Formats', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    describe('date-time', function () {

      it('should provide an error name', function () {
        this.validator.validate("2012-07-08", {'type': 'string', 'format': 'date-time'})
            .errors[0].name.should.equal('format');
      });

      it('should provide an error argument', function () {
        this.validator.validate("2012-07-08", {'type': 'string', 'format': 'date-time'})
            .errors[0].argument.should.equal('date-time');
      });

    });

    describe('date', function () {

      it('should provide an error name', function () {
        this.validator.validate("TEST2012-07-08", {'type': 'string', 'format': 'date'})
            .errors[0].name.should.equal('format');
      });

      it('should provide an error argument', function () {
        this.validator.validate("TEST2012-07-08", {'type': 'string', 'format': 'date'})
            .errors[0].argument.should.equal('date');
      });

    });

    describe('time', function () {

      it('should provide an error name', function () {
        this.validator.validate("16:41:41.532Z", {'type': 'string', 'format': 'time'})
            .errors[0].name.should.equal('format');
      });

      it('should provide an error argument', function () {
        this.validator.validate("16:41:41.532Z", {'type': 'string', 'format': 'time'})
            .errors[0].argument.should.equal('time');
      });

    });

    describe('utc-millisec', function () {

      it('should provide an error name', function () {
        this.validator.validate("16:41:41.532Z", {'type': 'string', 'format': 'utc-millisec'})
            .errors[0].name.should.equal('format');
      });

      it('should provide an error argument', function () {
        this.validator.validate("16:41:41.532Z", {'type': 'string', 'format': 'utc-millisec'})
            .errors[0].argument.should.equal('utc-millisec');
      });

    });

    describe('regex', function () {

      it('should provide an error name', function () {
        this.validator.validate("/^(abc]/", {'type': 'string', 'format': 'regex'})
            .errors[0].name.should.equal('format');
      });

      it('should provide an error argument', function () {
        this.validator.validate("/^(abc]/", {'type': 'string', 'format': 'regex'})
            .errors[0].argument.should.equal('regex');
      });

    });

    describe('color', function () {

      it('should provide an error name', function () {
        this.validator.validate("json", {'type': 'string', 'format': 'color'})
            .errors[0].name.should.equal('format');
      });

      it('should provide an error argument', function () {
        this.validator.validate("json", {'type': 'string', 'format': 'color'})
            .errors[0].argument.should.equal('color');
      });

    });

    describe('style', function () {

      it('should provide an error name', function () {
        this.validator.validate("0", {'type': 'string', 'format': 'style'})
            .errors[0].name.should.equal('format');
      });

      it('should provide an error argument', function () {
        this.validator.validate("0", {'type': 'string', 'format': 'style'})
            .errors[0].argument.should.equal('style');
      });

    });

    describe('phone', function () {

      it('should provide an error name', function () {
        this.validator.validate("31 42 123 4567", {'type': 'string', 'format': 'phone'})
            .errors[0].name.should.equal('format');
      });

      it('should provide an error argument', function () {
        this.validator.validate("31 42 123 4567", {'type': 'string', 'format': 'phone'})
            .errors[0].argument.should.equal('phone');
      });

    });

    describe('uri', function () {

      it('should provide an error name', function () {
        this.validator.validate("tdegrunt", {'type': 'string', 'format': 'uri'})
            .errors[0].name.should.equal('format');
      });

      it('should provide an error argument', function () {
        this.validator.validate("tdegrunt", {'type': 'string', 'format': 'uri'})
            .errors[0].argument.should.equal('uri');
      });

    });

    describe('email', function () {

      it('should provide an error name', function () {
        this.validator.validate("obama@", {'type': 'string', 'format': 'email'})
            .errors[0].name.should.equal('format');
      });

      it('should provide an error argument', function () {
        this.validator.validate("obama@", {'type': 'string', 'format': 'email'})
            .errors[0].argument.should.equal('email');
      });

    });

    describe('ip-address', function () {

      it('should provide an error name', function () {
        this.validator.validate("192.168.0", {'type': 'string', 'format': 'ip-address'})
            .errors[0].name.should.equal('format');
      });

      it('should provide an error argument', function () {
        this.validator.validate("192.168.0", {'type': 'string', 'format': 'ip-address'})
            .errors[0].argument.should.equal('ip-address');
      });

    });

    describe('ipv6', function () {

      it('should provide an error name', function () {
        this.validator.validate("127.0.0.1", {'type': 'string', 'format': 'ipv6'})
            .errors[0].name.should.equal('format');
      });

      it('should provide an error argument', function () {
        this.validator.validate("127.0.0.1", {'type': 'string', 'format': 'ipv6'})
            .errors[0].argument.should.equal('ipv6');
      });

    });

    describe('host-name', function () {

      it('should provide an error name', function () {
        this.validator.validate("www.-hi-.com", {'type': 'string', 'format': 'host-name'})
            .errors[0].name.should.equal('format');
      });

      it('should provide an error argument', function () {
        this.validator.validate("www.-hi-.com", {'type': 'string', 'format': 'host-name'})
            .errors[0].argument.should.equal('host-name');
      });

    });


    describe('alpha', function () {

      it('should provide an error name', function () {
        this.validator.validate("www.-hi-.com", {'type': 'string', 'format': 'alpha'})
            .errors[0].name.should.equal('format');
      });

      it('should provide an error argument', function () {
        this.validator.validate("www.-hi-.com", {'type': 'string', 'format': 'alpha'})
            .errors[0].argument.should.equal('alpha');
      });

    });

    describe('alphanumeric', function () {

      it('should provide an error name', function () {
        this.validator.validate("1test!", {'type': 'string', 'format': 'alphanumeric'})
            .errors[0].name.should.equal('format');
      });

      it('should provide an error argument', function () {
        this.validator.validate("1test!", {'type': 'string', 'format': 'alphanumeric'})
            .errors[0].argument.should.equal('alphanumeric');
      });

    });
  });

  describe('Arrays', function () {
    beforeEach(function () {
      this.validator = new Validator();
    });

    describe('simple array', function () {

      it('should provide an error name', function () {
        this.validator.validate(0, {'type': 'array'})
            .errors[0].name.should.equal('type');
      });

      it('should provide an error argument', function () {
        should.exist(this.validator.validate(0, {'type': 'array'})
            .errors[0].argument);
      });

      describe('attribute on array items', function () {

        it('should provide an error name', function () {
          this.validator.validate(['1', '2', '3', 4], {'type': 'array', 'items': {'type': 'string'}})
            .errors[0].name.should.equal('type');
        });

        it('should provide an error argument', function () {
          this.validator.validate(['1', '2', '3', '4$'], {'type': 'array', 'items': {'type': 'string', 'format': 'alphanumeric'}})
            .errors[0].argument.should.equal('alphanumeric');
        });

      });

    });

    describe('minItems', function () {

      it('should provide an error name', function () {
        this.validator.validate([1], {'type': 'array', 'items': {'type': 'number'}, 'minItems': 2})
            .errors[0].name.should.equal('minItems');
      });

      it('should provide an error argument', function () {
        should.exist(this.validator.validate([1], {'type': 'array', 'items': {'type': 'number'}, 'minItems': 2})
            .errors[0].argument);
      });

    });

    describe('maxItems', function () {

      it('should provide an error name', function () {
        this.validator.validate([1, 2, 3], {'type': 'array', 'items': {'type': 'number'}, 'maxItems': 2})
            .errors[0].name.should.equal('maxItems');
      });

      it('should provide an error argument', function () {
        should.exist(this.validator.validate([1, 2, 3], {'type': 'array', 'items': {'type': 'number'}, 'maxItems': 2})
            .errors[0].argument);
      });

    });

    describe('uniqueItems', function () {

      it('should provide an error name', function () {
        this.validator.validate([1, 2, 4, 1, 3, 5], {'type': 'array', 'uniqueItems': true})
            .errors[0].name.should.equal('uniqueItems');
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
            'items': {'type': 'string', 'format': 'alphanumeric'}
          }
        }
      };
    });

    describe('simple object with array with invalid items', function () {

      it('should provide an error name', function () {
        this.validator.validate({'name':'test', 'lines': ['1$']},this.mixedSchema)
          .errors[0].name.should.equal('format');
      });

      it('should provide an error argument', function () {
        this.validator.validate({'name':'test', 'lines': ['1$']},this.mixedSchema)
          .errors[0].argument.should.equal('alphanumeric');
      });
    });
  });

});
