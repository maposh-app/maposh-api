import {
  AttributeValue,
  DeleteItemInput,
  DeleteItemOutput,
  GetItemInput,
  GetItemOutput,
  PutItemInput,
  PutItemOutput,
  QueryInput,
  QueryOutput,
  ScanInput,
  ScanOutput,
  UpdateItemInput,
  UpdateItemOutput
} from "aws-sdk/clients/dynamodb";
import { promisify } from "../../../utils/helpers";

let docClient = require("serverless-dynamodb-client").doc;

if (process.env.NODE_ENV === "production") {
  const AWSXRay = require("aws-xray-sdk");
  const AWS = AWSXRay.captureAWS(require("aws-sdk"));
  docClient = new AWS.DocumentClient();
}

export const scan = (params: ScanInput) => {
  return promisify<ScanOutput>((callback: Promise<ScanOutput>) =>
    docClient.scan(params, callback)
  );
};

export const query = (params: QueryInput) => {
  return promisify<QueryOutput>((callback: Promise<QueryOutput>) =>
    docClient.query(params, callback)
  );
};

export const get = (params: GetItemInput) => {
  return promisify<GetItemOutput>((callback: Promise<GetItemOutput>) =>
    docClient.get(params, callback)
  );
};

export function getByKey(
  tableName: string,
  key: { [prop: string]: string },
  ...attributes: string[]
) {
  const params: GetItemInput = {
    TableName: tableName,
    Key: key as { [prop: string]: AttributeValue }
  };

  if (attributes.length >= 1) {
    params.ProjectionExpression = attributes.join();
  }

  return get(params);
}

export const createItem = (params: PutItemInput) => {
  return promisify<PutItemOutput>((callback: Promise<PutItemOutput>) =>
    docClient.put(params, callback)
  );
};

export const updateItem = (params: UpdateItemInput) => {
  return promisify<UpdateItemOutput>((callback: Promise<UpdateItemOutput>) =>
    docClient.update(params, callback)
  );
};

export const deleteItem = (params: DeleteItemInput) => {
  return promisify<DeleteItemOutput>((callback: Promise<DeleteItemOutput>) =>
    docClient.delete(params, callback)
  );
};
