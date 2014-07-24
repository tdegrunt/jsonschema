'use strict';

var Validator = require('../lib/validator');
require('chai').should();

describe('Options', function () {

	beforeEach(function () {
		this.validator = new Validator();
	});

	describe('validate without options', function () {
		it('should provide instance', function () {
			this.validator.validate(4, {"type": "string"}).errors.should.have.deep.property('0.instance', 4);
		});

		it('should provide schema', function () {
			this.validator.validate(4, {"type": "string"}).errors.should.have.deep.property('0.schema');
		});
	});

	describe('validate with option includeInstance = false', function () {
		it('should not provide empty instance', function () {
			this.validator.validate(4, {"type": "string"}, {includeInstance: false}).errors.should.have.deep.property('0.instance').to.deep.eql({});
		});
	});

	describe('validate with option includeSchema = false', function () {
		it('should provide empty schema', function () {
			this.validator.validate(4, {"type": "string"}, {includeSchema: false}).errors.should.have.deep.property('0.schema').to.deep.eql({});
		});
	});
});
