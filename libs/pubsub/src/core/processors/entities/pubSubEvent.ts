import {type Static, Type} from '@fastify/type-provider-typebox';

export const pubSubEventSchema = Type.Object({
  timestamp: Type.String(),
  source: Type.String(),
});

export type PubSubEvent = Static<typeof pubSubEventSchema>;
