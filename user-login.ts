import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: any) => {
  // TODO: get the user in the database
  return {};
};
