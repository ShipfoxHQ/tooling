import type {Static, TSchema} from '@fastify/type-provider-typebox';
import {log} from '@shipfox/node-log';
import type {ValidateFunction} from 'ajv';
import Ajv from 'ajv';
import addErrors from 'ajv-errors';
import addFormats from 'ajv-formats';

const ajv = new Ajv({strict: true, allErrors: true, removeAdditional: false});
addFormats(ajv);
addErrors(ajv);

const cache = new WeakMap<TSchema, ValidateFunction>();

function getValidator(schema: TSchema): ValidateFunction {
  let validate = cache.get(schema);
  if (!validate) {
    validate = ajv.compile(schema);
    cache.set(schema, validate);
  }
  return validate;
}

export function isValidJsonFeatureFlagPayload<T extends TSchema>(
  schema: T,
  payload: unknown,
): payload is Static<T> {
  const validate = getValidator(schema);
  const isValid = validate(payload);
  if (!isValid) log.error({error: validate.errors}, 'Failed to validate JSON feature flag body');
  return isValid;
}
