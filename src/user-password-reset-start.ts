import { DynamoDB } from 'aws-sdk';
import { MailService } from '@sendgrid/mail';

const dynamoDb = new DynamoDB.DocumentClient();
const sgMail = new MailService();

interface PasswordResetInput {
  username: string;
}

const corsHeaders = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
};

export const handler = async (event: any) => {
  if (!event?.body) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Invalid request',
      }),
    };
  }

  const input: PasswordResetInput = JSON.parse(event.body);

  if (!input?.username) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Username required',
      }),
    };
  }

  const getParams = {
    TableName: process.env.DYNAMODB_TABLE as string,
    Key: {
      PK: input.username,
      SK: input.username,
    },
  };

  const result = await dynamoDb.get(getParams).promise();
  const storedUser = result.Item;

  // We don't want to give away whether or not a user exists
  // FE should say "If you don't receive an email, please check your username and try again"
  if (!storedUser) {
    return {
      statusCode: 200,
      headers: corsHeaders,
    };
  }

  // Generate a password reset code 6 characters long and make it a string
  const token = Math.floor(Math.random() * 1000000).toString();
  const expires = new Date();
  expires.setHours(expires.getHours() + 1);

  const putParams = {
    TableName: process.env.DYNAMODB_TABLE as string,
    Item: {
      PK: input.username,
      SK: token,
      expires: expires.toISOString(),
    },
  };

  try {
    await dynamoDb.put(putParams).promise();

    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

    const message = {
      from: 'support@simulationexplorationexperience.com',
      templateId: 'd-87b60cd210cd40db8d3e117e0e276fd1',
      personalizations: [
        {
          to: [
            {
              email: input.username,
            },
          ],
          dynamic_template_data: {
            token,
          },
        },
      ],
    };

    await sgMail.send(message);
  } catch (error) {
    console.error(error);
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
  };
};
