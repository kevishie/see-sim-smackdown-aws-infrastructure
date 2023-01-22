import { DynamoDB } from 'aws-sdk';
import * as bcrypt from 'bcryptjs';

const dynamoDb = new DynamoDB.DocumentClient();

export class UserLogin {
  username: string;
  password: string;
}

export const handler = async (event: any) => {
  const user: UserLogin = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE as string,
    Key: {
      PK: user.username,
      SK: user.username,
    },
  };

  const result = await dynamoDb.get(params).promise();
  const storedUser = result.Item;

  if (!storedUser) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Username or password is incorrect' }),
    };
  }

  // Compare the provided password with the stored password
  const isPasswordCorrect = await bcrypt.compare(user.password, storedUser.password);

  if (!isPasswordCorrect) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Username or password is incorrect' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'User authenticated successfully' }),
  };
};
