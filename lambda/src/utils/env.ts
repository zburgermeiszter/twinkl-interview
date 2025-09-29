import 'dotenv/config';

const requiredEnvVars = ['AWS_REGION', 'DYNAMODB_TABLE_NAME'];

type env = NodeJS.ProcessEnv & {
  AWS_REGION: string;
  DYNAMODB_TABLE_NAME: string;
};

const checkRequiredEnvVars = () => {
  const missingVariables = requiredEnvVars.filter((variableName) => !process.env[variableName]);

  if (missingVariables.length > 0) {
    throw new Error(`Missing environment variables: ${missingVariables.join(',')}`);
  }
};

export const getEnv = () => {
  checkRequiredEnvVars();
  return process.env as env;
};
