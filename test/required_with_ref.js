'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var util = require('util')
var fs = require('fs')
var assert = require('chai').assert
var Validator = require('../lib/validator')

/**
* sort of functional test for "extends" and "required"
*/
describe('required with $ref', function () {
	var json, validator, schema, data, payment;

	beforeEach(function () {
		if(!json) {
			json = {
				schema  :fs.readFileSync('test/fixtures/data_schema.json')
				,types  :fs.readFileSync('test/fixtures/types.json')
				,data   :fs.readFileSync('test/fixtures/data.json')
			}
		}
		validator = new Validator()
	  schema            = JSON.parse(json.schema)
		validator.addSchema(JSON.parse(json.types), '/types.json')
	  data              = JSON.parse(json.data)
		payment = data.payment
	})

	function assertValid(p) {
		validate(p, true)
	}
	function assertNotValid(p) {
		validate(p, false)
	}
	function validate(p, bool) {
		var result = validator.validate(p, schema)
		//console.log(util.inspect(validator,{depth: 3 }))
		assert.strictEqual(result.valid, bool, util.inspect(result.errors, { showHidden: false, depth: 1 }))
	}

	describe('fixture', function () {
		it('should validate', function () {
			assertValid(data)
		})
		it('with wrong root node schould not be valid', function(){
			assertNotValid({wrong_root:payment})
		})
	})

	describe('required positive integer (amount)', function() {
		describe('valid', function() {
			it('1', function () {
				payment.amount = 1;
				assertValid(data)
			})
			it('1000000000', function () {
				payment.amount = 1000000000;
				assertValid(data)
			})
		})
		describe('not valid', function() {
			it('missing', function () {
				delete(payment.amount)
				assertNotValid(data)
			})
			it('1.2', function () {
				payment.amount = 1.2;
				assertNotValid(data)
			})
			it('0', function () {
				payment.amount = 0;
				assertNotValid(data)
			})
			it('-1', function () {
				payment.amount = -1;
				assertNotValid(data)
			})
			it('-1.2', function () {
				payment.amount = -1.2;
				assertNotValid(data)
			})
			it('foo', function () {
				payment.amount = 'foo';
				assertNotValid(data)
			})
		})
	})


	describe('required positive integer via $ref (other_amount)', function() {
		describe('valid', function() {
			it('1', function () {
				payment.other_amount = 1;
				assertValid(data)
			})
			it('1000000000', function () {
				payment.other_amount = 1000000000;
				assertValid(data)
			})
		})
		describe('not valid', function() {
			it('missing', function () {
				delete(payment.other_amount)
				assertNotValid(data)
			})
			it('1.2', function () {
				payment.other_amount = 1.2;
				assertNotValid(data)
			})
			it('0', function () {
				payment.other_amount = 0;
				assertNotValid(data)
			})
			it('-1', function () {
				payment.other_amount = -1;
				assertNotValid(data)
			})
			it('-1.2', function () {
				payment.other_amount = -1.2;
				assertNotValid(data)
			})
			it('foo', function () {
				payment.other_amount = 'foo';
				assertNotValid(data)
			})
		})
	})

	describe('optional string 1..255 (usage)', function() {
		describe('valid', function() {
			it('missing', function () {
				delete(payment.usage);
				assertValid(data)
			})
			it('string', function () {
				payment.usage = "the usage";
				assertValid(data)
			})
			it('"a"', function () {
				payment.usage = 'a';
				assertValid(data)
			})
			it('255 chars', function () {
				payment.usage =
					 "bbbbbbbbbbqqqqqqqqqqbbbbbbbbbbqqqqqqqqqqbbbbbbbbbbqqqqqqqqqqbbbbbbbbbbqqqqqqqqqqbbbbbbbbbbqqqqqqqqqq"
					+"bbbbbbbbbbqqqqqqqqqqbbbbbbbbbbqqqqqqqqqqbbbbbbbbbbqqqqqqqqqqbbbbbbbbbbqqqqqqqqqqbbbbbbbbbbqqqqqqqqqq"
					+"bbbbbbbbbbqqqqqqqqqqbbbbbbbbbbqqqqqqqqqqbbbbbbbbbbzzzzz";
				assertValid(data)
			})
		})
		describe('not valid', function() {
			it('1234', function () {
				payment.usage = 1234;
				assertNotValid(data)
			})
			it('null', function () {
				payment.usage = null;
				assertNotValid(data)
			})
			it('""', function () {
				payment.usage = '';
				assertNotValid(data)
			})
			it('256 chars', function () {
				payment.usage =
					 "bbbbbbbbbbqqqqqqqqqqbbbbbbbbbbqqqqqqqqqqbbbbbbbbbbqqqqqqqqqqbbbbbbbbbbqqqqqqqqqqbbbbbbbbbbqqqqqqqqqq"
					+"bbbbbbbbbbqqqqqqqqqqbbbbbbbbbbqqqqqqqqqqbbbbbbbbbbqqqqqqqqqqbbbbbbbbbbqqqqqqqqqqbbbbbbbbbbqqqqqqqqqq"
					+"bbbbbbbbbbqqqqqqqqqqbbbbbbbbbbqqqqqqqqqqbbbbbbbbbbzzzzzX";
				assertNotValid(data)
			})
		})
	})
})