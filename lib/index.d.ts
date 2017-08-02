/*
This is type definition for typescript.
This is for library users. Thus, properties and methods for internal use is omitted.
 */
export declare class Validator<S extends Schema<S>> {
    constructor();
    customFormats: CustomFormat[];
    schemas: {[id:string]: Schema<S>};
    unresolvedRefs: string[];

    attributes: {[property:string]: CustomProperty<S>};

    addSchema(schema?: S, uri?: string): S | void;
    validate(instance: any, schema: S | string, options?: Options<S>, ctx?: SchemaContext<S>): ValidatorResult<S>;
}

export declare class ValidatorResult<S extends Schema<S>> {
    constructor(instance: any, schema: S, options: Options<S>, ctx: SchemaContext<S>)
    instance: any;
    schema: S;
    propertyPath: string;
    errors: ValidationError<S>[];
    throwError: boolean;
    disableFormat: boolean;
    valid: boolean;
    addError(detail:string | ErrorDetail): ValidationError<S>;
    toString(): string;
}

export declare class ValidationError<S extends Schema<S>> {
    constructor(message?: string, instance?: any, schema?: S, propertyPath?: any, name?: string, argument?: any);
    property: string;
    message: string;
    schema: string | S;
    instance: any;
    name: string;
    argument: any;
    toString(): string;
}

export declare class SchemaError<S extends Schema<S>> extends Error{
    constructor(msg: string, schema: S);
    schema: S;
    message: string;
}

export declare function validate<S extends Schema<S>>(instance: any, schema: any, options?: Options<S>): ValidatorResult<S>

export interface Schema<S extends Schema<S>> {
    id?: string
    $schema?: string
    $ref?: string
    title?: string
    description?: string
    multipleOf?: number
    maximum?: number
    exclusiveMaximum?: boolean
    minimum?: number
    exclusiveMinimum?: boolean
    maxLength?: number
    minLength?: number
    pattern?: string
    additionalItems?: boolean | Schema<S>
    items?: Schema<S> | Schema<S>[]
    maxItems?: number
    minItems?: number
    uniqueItems?: boolean
    maxProperties?: number
    minProperties?: number
    required?: string[]
    additionalProperties?: boolean | Schema<S>
    definitions?: {
        [name: string]: Schema<S>
    }
    properties?: {
        [name: string]: Schema<S>
    }
    patternProperties?: {
        [name: string]: Schema<S>
    }
    dependencies?: {
        [name: string]: Schema<S> | string[]
    }
    'enum'?: any[]
    type?: string | string[]
    allOf?: Schema<S>[]
    anyOf?: Schema<S>[]
    oneOf?: Schema<S>[]
    not?: Schema<S>
}

export interface Options<S extends Schema<S>> {
    skipAttributes?: string[];
    allowUnknownAttributes?: boolean;
    rewrite?: RewriteFunction<S>
    propertyName?: string;
    base?: string;
    [option: string]: any;
}

export interface RewriteFunction<S extends Schema<S>> {
    (instance: any, schema?: S, options?: Options<S>, ctx?: SchemaContext<S>): any;
}

export interface SchemaContext<S extends Schema<S>> {
    schema: S;
    options: Options<S>;
    propertyPath: string;
    base: string;
    schemas: {[base:string]: S};
}

export interface CustomFormat {
    (input: any): boolean;
}

export interface CustomProperty<S extends Schema<S>> {
    (instance: any, schema: S, options: Options<S>, ctx: SchemaContext<S>): string | ValidatorResult<S>;
}

export interface ErrorDetail {
    message: string;
    name: string;
    argument: string;
}
