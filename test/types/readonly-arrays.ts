import { Validator } from '../../lib/index.js';
import type { Schema } from '../../lib/index.js';

const stringSchema = Object.freeze({ type: 'string' });
const typeOptions = ['string', 'number'] as const;
const enumValues = ['red', 'blue'] as const;
const requiredNames = ['name'] as const;
const dependencyNames = ['id'] as const;
const tupleItems = [stringSchema] as const;
const allRules = [stringSchema, { minLength: 2 }] as const;
const alternatives = [stringSchema, { type: 'number' }] as const;
const examples = ['example'] as const;
const tests: ReadonlyArray<{ schema: Schema; valid: unknown; invalid: unknown }> = [
    { schema: { type: typeOptions }, valid: 'text', invalid: false },
    { schema: { enum: enumValues }, valid: 'red', invalid: 'green' },
    { schema: { required: requiredNames }, valid: { name: 'text' }, invalid: {} },
    { schema: { dependencies: { name: dependencyNames } }, valid: { name: 'text', id: 1 }, invalid: { name: 'text' } },
    { schema: { items: tupleItems }, valid: ['text'], invalid: [1] },
    { schema: { allOf: allRules }, valid: 'text', invalid: 'a' },
    { schema: { anyOf: alternatives }, valid: 1, invalid: false },
    { schema: { oneOf: alternatives }, valid: 'text', invalid: false },
    { schema: { examples: examples, type: 'string' }, valid: 'text', invalid: 1 },
];

function freeze(value: unknown): void {
    if (value && typeof value === 'object') {
        Object.keys(value).forEach(key => freeze((value as { [key: string]: unknown })[key]));
        Object.freeze(value);
    }
}

const validator = new Validator();
tests.forEach(({ schema, valid, invalid }) => {
    freeze(schema);
    if (!validator.validate(valid, schema).valid || validator.validate(invalid, schema).valid) {
        throw new Error('Unexpected validation result for ' + JSON.stringify(schema));
    }
});

// Existing mutable array inputs are still accepted.
const mutableTypes: string[] = ['string', 'number'];
const mutableSchemas: Schema[] = [stringSchema];
const mutable: Schema = { type: mutableTypes, anyOf: mutableSchemas };
validator.validate('text', mutable);

function rejectInvalidElements(): void {
    // @ts-expect-error Required property names must remain strings.
    const badRequired: Schema = { required: [1] as const };
    // @ts-expect-error Type names must remain strings.
    const badTypes: Schema = { type: [1] as const };
    // @ts-expect-error Combinators must contain schemas.
    const badCombinator: Schema = { allOf: ['string'] as const };
    // @ts-expect-error Dependency property names must remain strings.
    const badDependencies: Schema = { dependencies: { name: [1] as const } };
}
