import { DynamoDB } from 'aws-sdk';
import { randomUUID } from 'crypto';
import { IsString, IsDefined, validate } from 'class-validator';
import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';

const dynamoDb = new DynamoDB.DocumentClient();

export class CreateUserBody {
  @IsDefined()
  @IsString()
  firstName: string;

  @IsDefined()
  @IsString()
  lastName: string;

  @IsDefined()
  @IsString()
  email: string;

  @IsDefined()
  @IsString()
  password: string;
}

export const userRegister = async (
  event: { body: CreateUserBody },
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(event);
  console.log(event.body);
  const user = event.body;

  validate(user).then((errors) => {
    if (errors.length > 0) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          message: 'Validation failed',
          errors,
        }),
      };
    }
  });

  const getParams = {
    TableName: process.env.DYNAMODB_TABLE as string,
    Key: {
      PK: user.email,
    },
  };

  // Check to see if user already exists
  const userExists = await dynamoDb.get(getParams).promise();

  if (userExists.Item) {
    return {
      statusCode: 409,
      body: JSON.stringify({
        message: 'User already exists',
      }),
    };
  }

  // Create a copy of the user object to avoid modifying the original
  const modifiedUser = { ...user } as CreateUserBody;

  // Create a new user in the database
  const params = {
    TableName: process.env.DYNAMODB_TABLE as string,
    Item: {
      PK: modifiedUser.email,
      SK: Math.floor(Date.now() / 1000),
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
