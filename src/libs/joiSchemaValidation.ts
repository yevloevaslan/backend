import { badRequest } from 'boom';
import Joi from 'joi';

export function schemaErrorHandler (joiResult: Joi.ValidationResult): void { 
    if (joiResult.error && joiResult.error.details && joiResult.error.details[0]) {
        throw badRequest(joiResult.error.details[0].message);
    }
}