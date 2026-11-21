// Run with: tsc --strict --noEmit test/types/custom-property.ts
import { CustomProperty, Validator, ValidatorResult } from '../../lib';

const validator = new Validator();

const noError: CustomProperty = (): void => {};
const undefinedError: CustomProperty = () => undefined;
const optionalError: CustomProperty = (instance) => {
    if (typeof instance !== 'string') return;
    if (instance.length === 0) return 'must not be empty';
};
const resultError: CustomProperty = (instance, schema, options, ctx) => {
    return new ValidatorResult(instance, schema, options, ctx);
};

validator.attributes.noError = noError;
validator.attributes.undefinedError = undefinedError;
validator.attributes.optionalError = optionalError;
validator.attributes.resultError = resultError;

// @ts-expect-error A boolean is not a custom keyword validation result.
const invalidResult: CustomProperty = () => false;
