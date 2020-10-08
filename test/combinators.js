'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var Validator = require('../lib/index.js').Validator;

require('chai').should();

describe('Combinators', function () {
  beforeEach(function () {
    this.validator = new Validator();
  });

  describe('anyOf', function () {
    beforeEach(function () {
      this.schema = {
        'type': 'object',
        'anyOf': [{
          'properties': {
            'name': {'type': 'string', 'enum': ['test1'] },
          },
        }, {
          'properties': {
            'name': {'type': 'string', 'enum': ['test2'] },
          },
        }],
      };
    });

    it('should validate if matches any of', function () {
      this.validator.validate({ 'name': 'test2' }, this.schema).valid.should.be.true;
    });

    it('should not validate if not match any of', function () {
      this.validator.validate({ 'name': 'test3' }, this.schema).valid.should.be.false;
    });

    it('should not throw if valid when throwError is set', function () {
      (function() {
        this.validator.validate({ 'name': 'test2' }, this.schema, { throwError: true });
      }.bind(this)).should.not.throw();
    });

    it('should throw if invalid when throwError is set', function () {
      (function() {
        this.validator.validate({ 'name': 'test3' }, this.schema, { throwError: true });
      }.bind(this)).should.throw();
    });
  });

  describe('oneOf', function () {
    beforeEach(function () {
      this.schema = {
        'type': 'object',
        'oneOf': [{
          'properties': {
            'name1': {'type': 'string', 'enum': ['test1'] },
          },
          'additionalProperties': false,
        }, {
          'properties': {
            'name2': {'type': 'string', 'enum': ['test2'] },
          },
          'additionalProperties': false,
        }],
      };
    });

    it('should validate if matches exactly one of', function () {
      this.validator.validate({ 'name2': 'test2' }, this.schema).valid.should.be.true;
    });

    it('should not validate if not match exactly one of', function () {
      this.validator.validate({ 'name1': 'test1', 'name2': 'test2' }, this.schema).valid.should.be.false;
    });

    it('should not throw if valid when throwError is set', function () {
      (function() {
        this.validator.validate({ 'name2': 'test2' }, this.schema, { throwError: true });
      }.bind(this)).should.not.throw();
    });

    it('should throw if invalid when throwError is set', function () {
      (function() {
        this.validator.validate({ 'name1': 'test1', 'name2': 'test2' }, this.schema, { throwError: true });
      }.bind(this)).should.throw();
    });
  });

});
