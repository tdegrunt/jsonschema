import {Schema, Validator, ValidatorResult, validate} from '../..';

const validator = new Validator();
const schema: Schema = {
    definitions: {anything: true, nothing: false},
    properties: {default: true, forbidden: false},
    patternProperties: {'^optional': true},
    items: [true, false, {type: 'string'}],
    additionalItems: false,
    contains: true,
    propertyNames: false,
    additionalProperties: true,
    dependencies: {name: true, other: ['name']},
    allOf: [true, {type: 'object'}],
    anyOf: [true, false],
    oneOf: [false, {type: 'object'}],
    not: false,
    if: true,
    then: true,
    else: false,
};

validator.validate({}, schema);
validator.validate({}, true);
validator.validate({}, false);
validator.validate([], {items: true});
validate({}, false);

// Schema remains an interface for existing object-schema extensions.
interface DocumentedSchema extends Schema {
    documentation: string;
}
const documented: DocumentedSchema = {documentation: 'example', type: 'string'};
validator.addSchema(documented);

// Invalid schema values must still be rejected.
// @ts-expect-error A number is not a property schema.
const invalidProperty: Schema = {properties: {value: 42}};
// @ts-expect-error A string is not an items schema.
const invalidItems: Schema = {items: 'string'};
// @ts-expect-error A number is not a root schema.
validator.validate({}, 42);

declare const result: ValidatorResult;
const returnedSchema: Schema | boolean = result.schema;
if (typeof returnedSchema !== 'boolean') {
    const title: string | undefined = returnedSchema.title;
}
