import { type Instance } from '@aws-sdk/client-ec2';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { type marshallOptions, type unmarshallOptions } from '@aws-sdk/util-dynamodb';
import { chunk } from './chunk';
import { DYNAMODB_MAX_CHUNK_SIZE } from './consts';

export const saveInstancesToDynamoDB = async (tableName: string, instances: Instance[]) => {
  if (instances.length === 0) {
    return;
  }

  const marshallOptions: marshallOptions = {
    convertClassInstanceToMap: true,
  };
  const unmarshallOptions: unmarshallOptions = {};
  const translateConfig = { marshallOptions, unmarshallOptions };

  const ddClient = new DynamoDBClient();
  const docClient = DynamoDBDocumentClient.from(ddClient, translateConfig);

  const promises = chunk(instances, DYNAMODB_MAX_CHUNK_SIZE).map((chunkOfInstances) => {
    const command = new BatchWriteCommand({
      RequestItems: {
        [tableName]: chunkOfInstances.map((instance) => ({
          PutRequest: {
            Item: instance,
          },
        })),
      },
    });

    return docClient.send(command);
  });

  return await Promise.all(promises);
};
