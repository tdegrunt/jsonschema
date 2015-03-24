'use strict';

/*jsl predef:define*/
/*jsl predef:it*/

var Validator = require('../lib/validator');
var should = require('chai').should();

describe('FormatReplacement', function () {
  describe('Structure with date', function () {
      before(function () {
          this.validator = new Validator();
          this.validator.replacingValueIfStringIsFormat = {
              "date-time": Date
          };

          this.schema = {
              "type": "object",
              "properties": {
                  "mydate": {
                      "type": ["string", "date"],
                      "format": "date-time"
                  }
              },
              "additionalProperties": false
          };


      });

      it('should validate a date object', function () {
          var struct = {mydate: new Date()};
          this.validator.validate(struct, this.schema).valid.should.be.true;
      });

      it('should validate a date as ISO8601 string and replace it as a Date object', function () {
          var mydate = new Date();
          var struct = {"mydate": mydate.toISOString()};
          var validation = this.validator.validate(struct, this.schema);
          validation.valid.should.be.true;
          (struct.mydate instanceof Date).should.be.true;
          (struct.mydate.toISOString() === mydate.toISOString()).should.be.true;
      });

      it('should not validate a string and should not replace it as a Date object', function () {
          var mydate = "myfakedate";
          var struct = {"mydate": mydate};
          var validation = this.validator.validate(struct, this.schema);
          validation.valid.should.be.false;
          (struct.mydate instanceof Date).should.be.false;
          (struct.mydate === mydate).should.be.true;
      });
  });

/*
  Uncomment bellow code if you want to test mongodb objectid replacement and validation.
  It needs to install mongodb package before : npm install mongodb --save-dev

  describe('Structure with ObjectID', function () {
      var ObjectID = require('mongodb').ObjectID;
      before(function () {
          Validator.prototype.addFormat("objectid", /^[0-9a-fA-F]{24}$/);
          Validator.prototype.types.objectid = function testObjectID (instance) {
              return instance instanceof ObjectID;
          };

          this.validator = new Validator();
          this.validator.replacingValueIfStringIsFormat = {
              "objectid": ObjectID
          };



          this.schema = {
              "type": "object",
              "properties": {
                  "_id": {
                      "type": ["string", "objectid"],
                      "format": "objectid"
                  }
              },
              "additionalProperties": false
          };

      });

      it('should validate an ObjectID object', function () {
          var struct = {_id: new ObjectID()};
          this.validator.validate(struct, this.schema).valid.should.be.true;
      });

      it('should validate an ObjectId as string and replace it as an ObjectID object', function () {
          var objectid = new ObjectID();
          var struct = {"_id": objectid.toString()};
          var validation = this.validator.validate(struct, this.schema);
          validation.valid.should.be.true;
          (struct._id instanceof ObjectID).should.be.true;
          (struct._id.toString() === objectid.toString()).should.be.true;
      });

      it('should not validate a string and should not replace it as a ObjectID object', function () {
          var objectid = "myfakeobjectid";
          var struct = {"_id": objectid};
          var validation = this.validator.validate(struct, this.schema);
          validation.valid.should.be.false;
          (struct._id instanceof Date).should.be.false;
          (struct._id === objectid).should.be.true;
      });
  });
 */
});
