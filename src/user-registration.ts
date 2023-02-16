import { DynamoDB } from 'aws-sdk';
import { randomUUID } from 'crypto';
import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import * as bcrypt from 'bcryptjs';

const dynamoDb = new DynamoDB.DocumentClient();

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accessCode: string;
}

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  if (!event?.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid request',
      }),
    };
  }

  const user: User = JSON.parse(event.body);

  if (!user?.accessCode || user.accessCode.toUpperCase() !== 'SEE2023') {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'A valid access code is required',
      }),
    };
  }

  if (!user?.email) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Email required',
      }),
    };
  }

  if (!user?.password) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Password required',
      }),
    };
  }

  const getParams = {
    TableName: process.env.DYNAMODB_TABLE as string,
    Key: {
      PK: user.email,
      SK: user.email,
    },
  };

  // Check to see if user already exists
  const userExists = await dynamoDb.get(getParams).promise();

  if (userExists?.Item) {
    return {
      statusCode: 409,
      body: JSON.stringify({
        message: 'User already exists',
      }),
    };
  }

  // Create a copy of the user object to avoid modifying the original
  const modifiedUser = { ...user } as User;

  // Hash the user's password
  const saltRounds = 10;
  modifiedUser.password = await bcrypt.hash(user.password, saltRounds);

  // Create a new user in the database
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

  return {
    statusCode: 200,
    body: JSON.stringify({
      uuid: randomUUID(),
    }),
  };
};
