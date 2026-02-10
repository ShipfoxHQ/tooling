import {parse as _parse} from './parser';
import type {AstNode} from './types';

export * from './types';

export const parse = _parse as (input: string) => AstNode | null;
export {stringify} from './stringify';
