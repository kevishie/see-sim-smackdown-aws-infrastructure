import { DynamoDB } from "aws-sdk";
import { randomUUID } from "crypto";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: any) => {
  // TODO: put the user in the database
  return { uuid: randomUUID() };
};
