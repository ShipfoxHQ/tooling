import type {LDContext} from '@launchdarkly/node-server-sdk';
import type {EvaluationContext} from '@openfeature/server-sdk';

export interface BlankContext {
  kind: 'blank';
}

export interface OrganizationContext {
  kind: 'organization';
  id: string;
}

export interface UserContext {
  kind: 'user';
  id: string;
  organizationId: string;
}

export interface RunnerContext {
  kind: 'runner';
  id: string;
  organizationId?: string;
  architecture: string;
  cpu: number;
  ram: number;
  osType: string;
  osName: string;
  osVersion: string;
  infrastructureProvider: string;
}

export type Context = BlankContext | OrganizationContext | UserContext | RunnerContext;

export function mapContext(context: Context): EvaluationContext {
  if (context.kind === 'blank') return {targetingKey: 'blank', anonymous: true};
  const {id, ...rest} = context;
  return {targetingKey: id, ...rest};
}

export function mapContextToLDContext(context: Context): LDContext {
  if (context.kind === 'blank') return {kind: 'blank', anonymous: true, key: 'blank'};
  const {kind, id, ...rest} = context;
  return {kind, key: id, ...rest};
}
