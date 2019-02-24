import {
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
import { promisify } from "../../utils/helpers";

let docClient = require("serverless-dynamodb-client").doc;

if (process.env.NODE_ENV === "production") {
  const AWSXRay = require("aws-xray-sdk");
  const AWS = AWSXRay.captureAWS(require("aws-sdk"));
  docClient = new AWS.DocumentClient();
}

export const scan = (params: ScanInput) => {
  return promisify<ScanOutput>((callback: Function) =>
    docClient.scan(params, callback)
  );
};

export const query = (params: QueryInput) => {
  return promisify<QueryOutput>((callback: Function) =>
    docClient.query(params, callback)
  );
};

export const get = (params: GetItemInput) => {
  return promisify<GetItemOutput>((callback: Function) =>
    docClient.get(params, callback)
  );
};

export const createItem = (params: PutItemInput) => {
  return promisify<PutItemOutput>((callback: Function) =>
    docClient.put(params, callback)
  );
};

export const updateItem = (params: UpdateItemInput) => {
  return promisify<UpdateItemOutput>((callback: Function) =>
    docClient.update(params, callback)
  );
};

export const deleteItem = (params: DeleteItemInput) => {
  return promisify<DeleteItemOutput>((callback: Function) =>
    docClient.delete(params, callback)
  );
};
