/*
This is type definition for typescript.
This is for library users. Thus, properties and methods for internal use is omitted.
 */
export declare class Validator {
    constructor();
    customFormats: {[formatName: string]: CustomFormat};
    schemas: {[id: string]: Schema};
    unresolvedRefs: string[];

    attributes: {[property: string]: CustomProperty};

    addSchema(schema?: Schema, uri?: string): Schema|void;
    validate(instance: any, schema: Schema | boolean, options?: Options, ctx?: SchemaContext): ValidatorResult;
}

export declare class ValidatorResult {
    constructor(instance: any, schema: Schema | boolean, options: Options, ctx: SchemaContext)
    instance: any;
    schema: Schema | boolean;
    propertyPath: string;
    errors: ValidationError[];
    throwError: boolean;
    disableFormat: boolean;
    valid: boolean;
    addError(detail: string|ErrorDetail): ValidationError;
    toString(): string;
}

export declare class ValidatorResultError extends Error {
  instance: any;
  schema: Schema | boolean;
  options: Options;
  errors: ValidationError;
}

export declare class ValidationError {
    constructor(message?: string, instance?: any, schema?: Schema, propertyPath?: any, name?: string, argument?: any);
    path: (string|number)[];
    property: string;
    message: string;
    schema: string|Schema;
    instance: any;
    name: string;
    argument: any;
    toString(): string;
    stack: string;
}

export declare class SchemaError extends Error{
    constructor(msg: string, schema: Schema);
    schema: Schema;
    message: string;
}

export declare function validate(instance: any, schema: any, options?: Options): ValidatorResult

export interface Schema {
    $id?: string
    id?: string
    $schema?: string
    $ref?: string
    title?: string
    description?: string
    multipleOf?: number
    maximum?: number
    exclusiveMaximum?: number | boolean
    minimum?: number
    exclusiveMinimum?: number | boolean
    maxLength?: number
    minLength?: number
    pattern?: string | RegExp
    additionalItems?: boolean | Schema
    items?: boolean | Schema | (boolean | Schema)[]
    contains?: boolean | Schema
    maxItems?: number
    minItems?: number
    uniqueItems?: boolean
    maxProperties?: number
    minProperties?: number
    required?: string[] | boolean
    propertyNames?: boolean | Schema
    additionalProperties?: boolean | Schema
    definitions?: {
        [name: string]: boolean | Schema
    }
    properties?: {
        [name: string]: boolean | Schema
    }
    patternProperties?: {
        [name: string]: boolean | Schema
    }
    dependencies?: {
        [name: string]: boolean | Schema | string[]
    }
    const?: any
    'enum'?: any[]
    type?: string | string[]
    format?: string
    allOf?: (boolean | Schema)[]
    anyOf?: (boolean | Schema)[]
    oneOf?: (boolean | Schema)[]
    not?: boolean | Schema
    if?: boolean | Schema
    then?: boolean | Schema
    else?: boolean | Schema
    default?: any
    examples?: any[]
}

export interface Options {
    skipAttributes?: string[];
    allowUnknownAttributes?: boolean;
    preValidateProperty?: PreValidatePropertyFunction;
    rewrite?: RewriteFunction;
    base?: string;
    throwError?: boolean;
    required?: boolean;
    throwFirst?: boolean;
    throwAll?: boolean;
    nestedErrors?: boolean;
}

export interface RewriteFunction {
    (instance: any, schema: Schema, options: Options, ctx: SchemaContext): any;
}

export interface PreValidatePropertyFunction {
    (instance: any, key: string, schema: Schema, options: Options, ctx: SchemaContext): any;
}

export interface SchemaContext {
    schema: Schema | boolean;
    options: Options;
    propertyPath: string;
    base: string;
    schemas: {[base: string]: Schema};
    makeChild: (schema: Schema | boolean, key: string) => SchemaContext;
}

export interface CustomFormat {
    (input: any): boolean;
}

export interface CustomProperty {
    (instance: any, schema: Schema, options: Options, ctx: SchemaContext): string|ValidatorResult;
}

export interface ErrorDetail {
    message: string;
    name: string;
    argument: string;
}
