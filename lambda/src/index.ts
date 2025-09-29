import type { Context, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { getEc2Instances } from './utils/ec2';
import { saveInstancesToDynamoDB } from './utils/dynamodb';
import { getEnv } from './utils/env';

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const env = getEnv();
    const instances = await getEc2Instances();
    await saveInstancesToDynamoDB(env.DYNAMODB_TABLE_NAME, instances);

    const message = 'EC2 instance details saved to DynamoDB';
    console.log(message);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message,
      }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
      }),
    };
  }
};

// handler({} as APIGatewayEvent, {} as any);
