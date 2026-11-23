'use strict';

var expect = require('chai').expect;
var validate = require('../lib').validate;

describe('Calendar dates', function () {
  var valid = [
    '0000-02-29', '0001-02-28', '0004-02-29', '0096-02-29',
    '0100-02-28', '1600-02-29', '1900-02-28', '2000-02-29',
    '2024-02-29', '2100-02-28', '2019-01-31', '2019-04-30',
    '2019-06-30', '2019-08-31', '2019-09-30', '2019-10-31',
    '2019-11-30', '9999-12-31',
  ];
  var invalid = [
    '0001-02-29', '0099-02-29', '0100-02-29', '1900-02-29',
    '2100-02-29', '2019-02-29', '2019-02-30', '2019-02-31',
    '2024-02-30', '2019-04-31', '2019-06-31', '2019-09-31',
    '2019-11-31', '2019-00-01', '2019-13-01', '2019-01-00',
    '2019-01-32',
  ];

  [
    {format: 'date', suffix: ''},
    {format: 'date-time', suffix: 'T09:22:46.000Z'},
  ].forEach(function (definition) {
    var schema = {type: 'string', format: definition.format};

    describe(definition.format, function () {
      valid.forEach(function (date) {
        it('accepts ' + date, function () {
          expect(validate(date + definition.suffix, schema).valid).to.equal(true);
        });
      });

      invalid.forEach(function (date) {
        it('rejects ' + date, function () {
          var result = validate(date + definition.suffix, schema);
          expect(result.valid).to.equal(false);
          expect(result.errors).to.have.length(1);
          expect(result.errors[0].name).to.equal('format');
        });
      });

      it('still requires the complete date syntax', function () {
        ['2024-2-29', '24-02-29', '2024-02-290', ' 2024-02-29', 'not-a-date'].forEach(function (date) {
          expect(validate(date + definition.suffix, schema).valid).to.equal(false);
        });
      });

      it('can disable calendar validation with disableFormat', function () {
        expect(validate('2019-02-31' + definition.suffix, schema, {disableFormat: true}).valid).to.equal(true);
      });

      it('continues to ignore non-string values for the format keyword', function () {
        [null, 42, true, {}, [], undefined].forEach(function (value) {
          expect(validate(value, {format: definition.format}).valid).to.equal(true);
        });
      });
    });
  });

  it('validates the written calendar date independently of the UTC offset', function () {
    var schema = {format: 'date-time'};
    ['Z', '+14:00', '-12:00'].forEach(function (offset) {
      expect(validate('2024-02-29T00:15:00' + offset, schema).valid).to.equal(true);
      expect(validate('2019-02-29T00:15:00' + offset, schema).valid).to.equal(false);
    });
  });

  it('preserves existing separators, fractions and leap-second syntax', function () {
    [
      '2024-02-29t12:34:56.123456z',
      '2024-02-29 12:34:56+05:30',
      '2016-12-31T23:59:60Z',
    ].forEach(function (value) {
      expect(validate(value, {format: 'date-time'}).valid).to.equal(true);
    });
  });
});
