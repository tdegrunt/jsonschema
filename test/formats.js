'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var Validator = require('../lib/validator');
var should = require('chai').should();

describe('Formats', function () {
  beforeEach(function () {
    this.validator = new Validator();
  });

  describe('date-time', function () {
    it('should validate a valid date-time', function () {
      this.validator.validate("2012-07-08T16:41:41.532Z", {'type': 'string', 'format': 'date-time'}).valid.should.be.true;
    });

    it('should validate a valid date-time without milliseconds', function () {
      this.validator.validate("2012-07-08T16:41:41Z", {'type': 'string', 'format': 'date-time'}).valid.should.be.true;
    });

    it('should validate a date-time with a timezone offset instead of Z', function () {
        this.validator.validate("2012-07-08T16:41:41.532+00:00", {'type': 'string', 'format': 'date-time'}).valid.should.be.true;
        this.validator.validate("2012-07-08T16:41:41.532+05:30", {'type': 'string', 'format': 'date-time'}).valid.should.be.true;
        this.validator.validate("2012-07-08T16:41:41.532+04:00", {'type': 'string', 'format': 'date-time'}).valid.should.be.true;
    });

    it('should validate a date-time with a z instead of a Z', function () {
        this.validator.validate("2012-07-08T16:41:41.532z", {'type': 'string', 'format': 'date-time'}).valid.should.be.true;
    });

    it('should validate a date-time with a space instead of a T', function () {
        this.validator.validate("2012-07-08 16:41:41.532Z", {'type': 'string', 'format': 'date-time'}).valid.should.be.true;
    });

    it('should validate a date-time with a t instead of a T', function () {
        this.validator.validate("2012-07-08t16:41:41.532Z", {'type': 'string', 'format': 'date-time'}).valid.should.be.true;
    });

    it('should not validate a date-time with the time missing', function () {
      this.validator.validate("2012-07-08", {'type': 'string', 'format': 'date-time'}).valid.should.be.false;
    });

    it('should not validate an invalid date-time', function () {
      this.validator.validate("TEST2012-07-08T16:41:41.532Z", {'type': 'string', 'format': 'date-time'}).valid.should.be.false;
    });

    it('should not validate a date-time with a timezone offset AND a Z', function () {
        this.validator.validate("2012-07-08T16:41:41.532+00:00Z", {'type': 'string', 'format': 'date-time'}).valid.should.be.false;
        this.validator.validate("2012-07-08T16:41:41.532+Z00:00", {'type': 'string', 'format': 'date-time'}).valid.should.be.false;
    });
  });

  describe('date', function () {
    it('should validate a valid date', function () {
      this.validator.validate("2012-07-08", {'type': 'string', 'format': 'date'}).valid.should.be.true;
    });

    it('should not validate an invalid date', function () {
      this.validator.validate("TEST2012-07-08", {'type': 'string', 'format': 'date'}).valid.should.be.false;
    });

  });

  describe('time', function () {
    it('should validate a valid time', function () {
      this.validator.validate("16:41:41", {'type': 'string', 'format': 'time'}).valid.should.be.true;
    });

    it('should not validate an invalid time', function () {
      this.validator.validate("16:41:41.532Z", {'type': 'string', 'format': 'time'}).valid.should.be.false;
    });

  });

  describe('utc-millisec', function () {
    it('should validate a valid utc-millisec', function () {
      this.validator.validate("-1234567890", {'type': 'string', 'format': 'utc-millisec'}).valid.should.be.true;
    });

    it('should not validate an invalid utc-millisec', function () {
      this.validator.validate("16:41:41.532Z", {'type': 'string', 'format': 'utc-millisec'}).valid.should.be.false;
    });

  });

  describe('regex', function () {
    it('should validate a valid regex', function () {
      this.validator.validate("/a/", {'type': 'string', 'format': 'regex'}).valid.should.be.true;
    });

    it('should not validate an invalid regex', function () {
      this.validator.validate("/^(abc]/", {'type': 'string', 'format': 'regex'}).valid.should.be.false;
    });
  });

  describe('color', function () {
    it('should validate the color red', function () {
      this.validator.validate("red", {'type': 'string', 'format': 'color'}).valid.should.be.true;
    });

    it('should validate the color #f00', function () {
      this.validator.validate("#f00", {'type': 'string', 'format': 'color'}).valid.should.be.true;
    });

    it('should validate the color #ff0000', function () {
      this.validator.validate("#ff0000", {'type': 'string', 'format': 'color'}).valid.should.be.true;
    });

    it('should validate the color rgb(255,0,0)', function () {
      this.validator.validate("rgb(255,0,0)", {'type': 'string', 'format': 'color'}).valid.should.be.true;
    });

    it('should not validate an invalid color (json)', function () {
      this.validator.validate("json", {'type': 'string', 'format': 'color'}).valid.should.be.false;
    });
  });

  describe('style', function () {
    it('should validate a valid style', function () {
      this.validator.validate("color: red;", {'type': 'string', 'format': 'style'}).valid.should.be.true;
    });

    it('should validate a valid complex style', function () {
      this.validator.validate("color: red; position: absolute; background-color: rgb(204, 204, 204); max-width: 150px;", {'type': 'string', 'format': 'style'}).valid.should.be.true;
    });

    it('should validate a valid complex style', function () {
      this.validator.validate("color:red;position:absolute; background-color:     rgb(204, 204, 204); max-width: 150px;", {'type': 'string', 'format': 'style'}).valid.should.be.true;
    });

    it('should not validate an invalid style', function () {
      this.validator.validate("0", {'type': 'string', 'format': 'style'}).valid.should.be.false;
    });

  });

  describe('phone', function () {
    it('should validate a valid phone-number', function () {
      this.validator.validate("+31 42 123 4567", {'type': 'string', 'format': 'phone'}).valid.should.be.true;
    });

    it('should not validate an invalid phone-number', function () {
      this.validator.validate("31 42 123 4567", {'type': 'string', 'format': 'phone'}).valid.should.be.false;
    });
  });

  describe('uri', function () {
    it('should validate http://www.google.com/', function () {
      this.validator.validate("http://www.google.com/", {'type': 'string', 'format': 'uri'}).valid.should.be.true;
    });

    it('should validate http://www.google.com/search', function () {
      this.validator.validate("http://www.google.com/search", {'type': 'string', 'format': 'uri'}).valid.should.be.true;
    });

    it('should not validate relative URIs', function () {
      this.validator.validate("tdegrunt", {'type': 'string', 'format': 'uri'}).valid.should.be.false;
    });

    it('should not validate with whitespace', function () {
      this.validator.validate("The dog jumped", {'type': 'string', 'format': 'uri'}).valid.should.be.false;
    });
  });

  describe('email', function () {
    it('should validate obama@whitehouse.gov', function () {
      this.validator.validate("obama@whitehouse.gov", {'type': 'string', 'format': 'email'}).valid.should.be.true;
    });

    it('should validate barack+obama@whitehouse.gov', function () {
      this.validator.validate("barack+obama@whitehouse.gov", {'type': 'string', 'format': 'email'}).valid.should.be.true;
    });

    it('should not validate obama@', function () {
      this.validator.validate("obama@", {'type': 'string', 'format': 'email'}).valid.should.be.false;
    });
  });

  describe('ip-address', function () {
    it('should validate 192.168.0.1', function () {
      this.validator.validate("192.168.0.1", {'type': 'string', 'format': 'ip-address'}).valid.should.be.true;
    });

    it('should validate 127.0.0.1', function () {
      this.validator.validate("127.0.0.1", {'type': 'string', 'format': 'ip-address'}).valid.should.be.true;
    });

    it('should not validate 192.168.0', function () {
      this.validator.validate("192.168.0", {'type': 'string', 'format': 'ip-address'}).valid.should.be.false;
    });

    it('should not validate 256.168.0', function () {
      this.validator.validate("256.168.0", {'type': 'string', 'format': 'ip-address'}).valid.should.be.false;
    });
  });

  describe('ipv6', function () {
    it('should validate fe80::1%lo0', function () {
      this.validator.validate("fe80::1%lo0", {'type': 'string', 'format': 'ipv6'}).valid.should.be.true;
    });

    it('should validate ::1', function () {
      this.validator.validate("::1", {'type': 'string', 'format': 'ipv6'}).valid.should.be.true;
    });

    it('should not validate 127.0.0.1', function () {
      this.validator.validate("127.0.0.1", {'type': 'string', 'format': 'ipv6'}).valid.should.be.false;
    });

    it('should not validate localhost', function () {
      this.validator.validate("localhost", {'type': 'string', 'format': 'ipv6'}).valid.should.be.false;
    });

  });

  describe('host-name', function () {
    it('should validate localhost', function () {
      this.validator.validate("localhost", {'type': 'string', 'format': 'host-name'}).valid.should.be.true;
    });

    it('should validate www.google.com', function () {
      this.validator.validate("www.google.com", {'type': 'string', 'format': 'host-name'}).valid.should.be.true;
    });

    it('should not validate www.-hi-.com', function () {
      this.validator.validate("www.-hi-.com", {'type': 'string', 'format': 'host-name'}).valid.should.be.false;
    });
  });


  describe('alpha', function () {
    it('should validate alpha', function () {
      this.validator.validate("alpha", {'type': 'string', 'format': 'alpha'}).valid.should.be.true;
    });

    it('should validate abracadabra', function () {
      this.validator.validate("abracadabra", {'type': 'string', 'format': 'alpha'}).valid.should.be.true;
    });

    it('should not validate 1test', function () {
      this.validator.validate("www.-hi-.com", {'type': 'string', 'format': 'alpha'}).valid.should.be.false;
    });
  });

  describe('alphanumeric', function () {
    it('should validate alphanumeric', function () {
      this.validator.validate("alpha", {'type': 'string', 'format': 'alphanumeric'}).valid.should.be.true;
    });

    it('should validate 123', function () {
      this.validator.validate("123", {'type': 'string', 'format': 'alphanumeric'}).valid.should.be.true;
    });

    it('should validate abracadabra123', function () {
      this.validator.validate("abracadabra123", {'type': 'string', 'format': 'alphanumeric'}).valid.should.be.true;
    });

    it('should not validate 1test!', function () {
      this.validator.validate("1test!", {'type': 'string', 'format': 'alphanumeric'}).valid.should.be.false;
    });
  });

  describe('custom formats', function() {
    beforeEach(function() {
      this.validator.customFormats.foo = function(input) {
        if (input === 'foo') {
          return true;
        }
        return false;
      };

      this.validator.customFormats.float = function(input) {
        //console.log(input);
        return /^\d+(?:\.\d+)?$/.test(input);
      };
    });

    it('should validate input', function() {
      this.validator.validate("foo", {'type': 'string', 'format': 'foo'}).valid.should.be.true;
    });

    it('should validate numeric input', function() {
      this.validator.validate(32.45, {'type': 'number', 'format': 'float'}).valid.should.be.true;
    });

    it('should fail input that fails validation', function() {
      this.validator.validate("boo", {'type': 'string', 'format': 'foo'}).valid.should.be.false;
    });

    it('should fail numeric input that fails validation', function() {
      this.validator.validate(NaN, {'type': 'number', 'format': 'float'}).valid.should.be.false;
    });

    describe('assigned to validator instances', function() {
      var format;

      beforeEach(function() {
        format = function() {};
        this.validator.customFormats.boo = format;
      });

      it('should not be assigned to the Validator prototype', function() {
        (typeof Validator.prototype.customFormats.boo).should.equal('undefined');
      });
    });

    describe('assigned to the Validator.prototype before validator instances are created', function() {
      var format;

      beforeEach(function() {
        format = function() {};
        Validator.prototype.customFormats.boo = format;
      });

      afterEach(function() {
        delete Validator.prototype.customFormats.boo;
      });

      it('should be assigned to the instances', function() {
        ((new Validator()).customFormats.boo).should.be.a.function;
      });
    });
  });

  describe('with options.disableFormat === true', function() {
    it('should validate invalid formats', function() {
      this.validator.validate("2012-07-08", {'type': 'string', 'format': 'date-time'},
          {disableFormat: true}).valid.should.be.true;
    });
  });

  describe('invalid format', function() {
    it('should validate', function () {
      this.validator.validate("url", {'type': 'string', 'format': 'url'}).valid.should.be.true;
    });
  });
});
