import {PubSub} from '@google-cloud/pubsub';
import {config} from 'config';
import {messageSentCount} from 'metrics';

const _pubsub = new PubSub({projectId: config.GOOGLE_CLOUD_PROJECT_ID});

export async function publish(
  topicName: string,
  data: string | Record<string, unknown> | Buffer,
): Promise<string> {
  const topic = _pubsub.topic(topicName);

  let dataBuffer: Buffer;
  if (Buffer.isBuffer(data)) {
    dataBuffer = data;
  } else if (typeof data === 'string') {
    dataBuffer = Buffer.from(data);
  } else {
    dataBuffer = Buffer.from(JSON.stringify(data));
  }

  const messageId = await topic.publishMessage({data: dataBuffer});
  messageSentCount.add(1, {topic: topicName, success: 'true'});
  return messageId;
}
