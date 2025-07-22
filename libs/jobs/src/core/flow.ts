import {FlowProducer} from 'bullmq';
import {getConnection} from './jobQueue';

let _flow: FlowProducer | undefined;

export function getFlow(): FlowProducer {
  if (!_flow) _flow = new FlowProducer({connection: getConnection()});
  return _flow;
}
