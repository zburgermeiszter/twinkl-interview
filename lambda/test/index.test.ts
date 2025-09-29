import { beforeAll, beforeEach, describe, expect, it, spyOn } from 'bun:test';
import { mockClient } from 'aws-sdk-client-mock';

import type { Context, APIGatewayProxyResult, APIGatewayEvent, APIGatewayProxyEvent } from 'aws-lambda';
import { DescribeInstancesCommand, EC2Client, type DescribeInstancesCommandOutput } from '@aws-sdk/client-ec2';
import { BatchWriteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { handler } from '../src';

const ddbDocMock = mockClient(DynamoDBDocumentClient);
const ec2Mock = mockClient(EC2Client);

describe('EC2 Inspector Lambda', () => {
  beforeEach(() => {
    ec2Mock.reset();
  });

  it('Retrieves a list of EC2 instances and saves it to DynamoDB', async () => {
    const tableName = 'mockDynamoDBTable';
    process.env.DYNAMODB_TABLE_NAME = tableName;

    const reservations = {
      Reservations: [
        {
          Instances: [
            {
              InstanceId: 'i-abcdef123',
            },
          ],
        },
        {
          Instances: [
            {
              InstanceId: 'i-xyz987',
            },
          ],
        },
      ],
    };

    const batchWriteCommandInputMock = {
      RequestItems: {
        [tableName]: [
          {
            PutRequest: {
              Item: {
                InstanceId: 'i-abcdef123',
              },
            },
          },
          {
            PutRequest: {
              Item: {
                InstanceId: 'i-xyz987',
              },
            },
          },
        ],
      },
    };

    ec2Mock.on(DescribeInstancesCommand).resolves(reservations);
    ddbDocMock.on(BatchWriteCommand).resolves({});

    const results = await handler({} as APIGatewayProxyEvent, {} as Context);

    const commandCall = ddbDocMock.commandCalls(BatchWriteCommand).pop()?.args.pop()?.input;
    expect(commandCall).toEqual(batchWriteCommandInputMock);

    expect(results).toEqual({
      body: '{"message":"EC2 instance details saved to DynamoDB"}',
      statusCode: 200,
    });
  });
});
