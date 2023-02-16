import { DynamoDB } from 'aws-sdk';
import * as bcrypt from 'bcryptjs';

const dynamoDb = new DynamoDB.DocumentClient();

interface PasswordResetInput {
  username: string;
  password: string;
  token: string;
}

export const handler = async (event: any) => {
  if (!event?.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid request',
      }),
    };
  }

  // Check if body is valid JSON
  try {
    JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid JSON',
      }),
    };
  }

  const input: PasswordResetInput = JSON.parse(event.body);

  if (!input?.username || !input?.password || !input?.token) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing required field(s)',
      }),
    };
  }

  const getParams = {
    TableName: process.env.DYNAMODB_TABLE as string,
    Key: {
      PK: input.username,
      SK: input.token,
    },
  };

  const result = await dynamoDb.get(getParams).promise();
  const passwordResetRequest = result?.Item;

  if (!passwordResetRequest) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Sorry, it looks like you may have entered the wrong code. Please check your code and try again.',
      }),
    };
  }

  const expires = new Date(passwordResetRequest.expires);
  const now = new Date();

  if (now > expires) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Sorry, it looks like your code has expired. Please request a new code and try again.',
      }),
    };
  }

  const getExistingUserParams = {
    TableName: process.env.DYNAMODB_TABLE as string,
    Key: {
      PK: input.username,
      SK: input.username,
    },
  };

  const userExists = await dynamoDb.get(getExistingUserParams).promise();

  if (!userExists?.Item) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Sorry, it looks like you may have entered the wrong code. Please check your code and try again.',
      }),
    };
  }

  const modifiedUser = { ...userExists.Item };

  // Hash the user's password
  const saltRounds = 10;
  modifiedUser.password = await bcrypt.hash(input.password, saltRounds);

  // Update the user's password
  const params = {
    TableName: process.env.DYNAMODB_TABLE as string,
    Item: {
      PK: modifiedUser.email,
      SK: modifiedUser.email,
      ...modifiedUser,
    },
  };

  try {
    await dynamoDb.put(params).promise();
  } catch (error) {
    console.error(error);
  }

  // Delete the password reset request (token)
  const deleteParams = {
    TableName: process.env.DYNAMODB_TABLE as string,
    Key: {
      PK: input.username,
      SK: input.token,
    },
  };

  try {
    await dynamoDb.delete(deleteParams).promise();
  } catch (error) {
    console.error(error);
  }

  return {
    statusCode: 200,
  };
};
