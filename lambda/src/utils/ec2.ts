import { DescribeInstancesCommand, EC2Client } from '@aws-sdk/client-ec2';

export const getEc2Instances = async () => {
  const client = new EC2Client();
  const input = {
    Filters: [
      {
        Name: 'instance-state-name',
        Values: ['running'],
      },
    ],
  };
  const command = new DescribeInstancesCommand(input);
  const response = await client.send(command);

  return response.Reservations?.map((reservation) => reservation.Instances || []).flat() || [];
};
