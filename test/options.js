'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var Validator = require('../lib/validator');
var should = require('chai').should();

describe('Option', function () {
  beforeEach(function () {
    this.validator = new Validator();
  });

  describe('clean:true', function() {
    var nameSchema = {
      type: 'object',
      properties: {
        name: { type:'string' }
      }
    };

    var cleanOption = {
      clean: true
    };

    it('should leave a declared property', function() {
      this.validator.validate({
        name: 'test',
        age: 42
      }, nameSchema, cleanOption).instance.should.have.property('name');
    });

    it('should remove an undelared property', function() {
      this.validator.validate({
        name: 'test',
        age: 42
      }, nameSchema, cleanOption).instance.should.not.have.property('age');
    });

    it('should not modify original instance', function() {
      var instance = {
        name: 'test',
        age: 42
      };
      var result = this.validator.validate(instance, nameSchema, cleanOption);
      instance.should.have.property('age');
    });

    it('should leave a declared nested property', function() {
      this.validator.validate({
        nested: {
          name: 'test',
          age: 42
        }
      }, {
        type: 'object',
        properties: {
          nested: nameSchema
        }
      }, cleanOption).instance.nested.should.have.property('name');
    });

    it('should remove an undelared nested property', function() {
      this.validator.validate({
        nested: {
          name: 'test',
          age: 42
        }
      }, {
        type: 'object',
        properties: {
          nested: nameSchema
        }
      }, cleanOption).instance.nested.should.not.have.property('age');
    });

    it('should not modify original instance with nested properties', function() {
      var instance = {
        nested: {
          name: 'test',
          age: 42
        }
      };
      var result = this.validator.validate(instance, {
        type: 'object',
        properties: {
          nested: nameSchema
        }
      }, cleanOption);
      instance.nested.should.have.property('age');
    });

    it('should leave a declared property in an array item', function() {
      this.validator.validate([{
        name: 'test',
        age: 42
      }], {
        type: 'array',
        items: nameSchema
      }, cleanOption).instance[0].should.have.property('name');
    });

    it('should remove an undelared property in an array item', function() {
      this.validator.validate([{
        name: 'test',
        age: 42
      }], {
        type: 'array',
        items: nameSchema
      }, cleanOption).instance[0].should.not.have.property('age');
    });

    it('should not modify original array instance or items', function() {
      var instance = [{
        name: 'test',
        age: 42
      }];
      var result = this.validator.validate(instance, {
        type: 'array',
        items: nameSchema
      }, cleanOption);
      instance[0].should.have.property('age');
    });
  });
});
