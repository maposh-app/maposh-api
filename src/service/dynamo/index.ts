import {
  AttributeValue,
  ConditionExpression,
  DeleteItemInput,
  DeleteItemOutput,
  ExpressionAttributeNameMap,
  ExpressionAttributeValueMap,
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
import _, { Dictionary } from "lodash";
import { promisify } from "../../utils/helpers/transform";

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

export function queryIndex(
  tableName: string,
  indexName: string,
  key: { [prop: string]: string | number }
) {
  const KeyConditionExpression = `${Object.keys(key)
    .map(attribute => `#${attribute} = :${attribute}`)
    .join(" ")}`;
  const ExpressionAttributeNames = _.transform(
    key,
    (result: Dictionary<string>, _value, attribute) => {
      result[`#${attribute}`] = attribute as string;
    }
  );

  const ExpressionAttributeValues = _.transform(
    key,
    (result, value, attribute) => {
      result[`:${attribute}`] = value;
    }
  );

  const params: QueryInput = {
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  };
  return query(params);
}

export function getByKey(
  tableName: string,
  key: { [prop: string]: string | number },
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

export function appendToAttributes(
  tableName: string,
  key: { [prop: string]: string | number },
  attributes: { [attribute: string]: [string | number | boolean] }
) {
  const UpdateExpression = `SET ${Object.keys(attributes)
    .map(
      attribute => `#${attribute} = list_append(${attribute}, :${attribute})`
    )
    .join()}`;

  const ExpressionAttributeValues = _.transform(
    attributes,
    (result, value, attribute) => {
      result[`:${attribute}`] = value;
    }
  );

  const ExpressionAttributeNames = _.transform(
    attributes,
    (result, _value, attribute) => {
      result[`#${attribute}`] = attribute;
    }
  ) as ExpressionAttributeNameMap;

  const Conditions: ConditionExpression = Object.keys(attributes)
    .map(attribute => `attribute_exists(${attribute})`)
    .join();

  const params: UpdateItemInput = {
    TableName: tableName,
    Key: key as { [prop: string]: AttributeValue },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ConditionExpression: Conditions,
    ReturnValues: "UPDATED_NEW"
  };

  return updateItem(params).catch(() => {
    const newUpdateExpression = `SET ${Object.keys(attributes)
      .map(attribute => `${attribute} = :${attribute}`)
      .join()}`;

    const newConditionExpression = Object.keys(attributes)
      .map(attribute => `attribute_not_exists(${attribute})`)
      .join();

    const newParams: UpdateItemInput = {
      TableName: tableName,
      Key: key as { [prop: string]: AttributeValue },
      UpdateExpression: newUpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ConditionExpression: newConditionExpression,
      ReturnValues: "UPDATED_NEW"
    };
    return updateItem(newParams);
  });
}

export function deleteFromSetAttributes(
  tableName: string,
  key: { [prop: string]: string | number },
  attributes: { [attribute: string]: string | number | Array<string | number> }
) {
  const UpdateExpression = `DELETE ${Object.keys(attributes)
    .map(attribute => `#${attribute} :${attribute}`)
    .join()}`;

  const ExpressionAttributeNames: ExpressionAttributeNameMap = _.transform(
    attributes,
    (result, _value, attribute) => {
      result[`#${attribute}`] = attribute;
    }
  );
  const ExpressionAttributeValues: ExpressionAttributeValueMap = _.transform(
    attributes,
    (result, value, attribute) => {
      result[`:${attribute}`] = docClient.createSet(value) as AttributeValue;
    }
  );
  const params: UpdateItemInput = {
    TableName: tableName,
    Key: key as { [prop: string]: AttributeValue },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: "UPDATED_NEW"
  };

  return updateItem(params);
}

export function modifyAttributes(
  tableName: string,
  key: { [prop: string]: string | number },
  increments?: { [attribute: string]: number | Array<string | number> },
  properties?: { [attribute: string]: AttributeValue },
  pops?: { [attribute: string]: string | number | Array<string | number> }
) {
  const UpdateExpression: string[] = [];
  let ExpressionAttributeNames: ExpressionAttributeNameMap = {};
  let ExpressionAttributeValues: ExpressionAttributeValueMap = {};

  let addExpressions: string[] = [];

  increments = increments
    ? _.transform(increments, (result, value, attribute) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            result[attribute] = value;
          }
        } else {
          result[attribute] = value;
        }
      })
    : undefined;

  if (increments && Object.keys(increments).length > 0) {
    addExpressions = addExpressions.concat(
      Object.keys(increments).map(attribute => `#${attribute} :${attribute}`)
    );
    ExpressionAttributeNames = {
      ...ExpressionAttributeNames,
      ..._.transform(increments, (result, _value, attribute) => {
        result[`#${attribute}`] = attribute;
      })
    };

    ExpressionAttributeValues = {
      ...ExpressionAttributeValues,
      ..._.transform(increments, (result, value, attribute) => {
        result[`:${attribute}`] = Array.isArray(value)
          ? docClient.createSet(value)
          : (value as AttributeValue);
      })
    };
  }

  if (addExpressions.length > 0) {
    UpdateExpression.push(`ADD ${addExpressions.join()}`);
  }

  properties = properties
    ? _.transform(properties, (result, value, attribute) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            result[attribute] = value;
          }
        } else {
          result[attribute] = value;
        }
      })
    : undefined;
  if (properties && Object.keys(properties).length > 0) {
    UpdateExpression.push(
      `SET ${Object.keys(properties)
        .map(attribute => `#${attribute} = :${attribute}`)
        .join()}`
    );

    ExpressionAttributeNames = {
      ...ExpressionAttributeNames,
      ..._.transform(properties, (result, _value, attribute) => {
        result[`#${attribute}`] = attribute;
      })
    };

    ExpressionAttributeValues = {
      ...ExpressionAttributeValues,
      ..._.transform(properties, (result, value, attribute) => {
        result[`:${attribute}`] = value;
      })
    };
  }

  pops = pops
    ? _.transform(pops, (result, value, attribute) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            result[attribute] = value;
          }
        } else {
          result[attribute] = value;
        }
      })
    : undefined;
  if (pops && Object.keys(pops).length > 0) {
    UpdateExpression.push(
      `DELETE ${Object.keys(pops)
        .map(attribute => `#${attribute} :${attribute}`)
        .join()}`
    );

    ExpressionAttributeNames = {
      ...ExpressionAttributeNames,
      ..._.transform(pops, (result, _value, attribute) => {
        result[`#${attribute}`] = attribute;
      })
    };
    ExpressionAttributeValues = {
      ...ExpressionAttributeValues,
      ..._.transform(pops, (result, value, attribute) => {
        result[`:${attribute}`] = docClient.createSet(value) as AttributeValue;
      })
    };
  }

  const params: UpdateItemInput = {
    TableName: tableName,
    Key: key as { [prop: string]: AttributeValue },
    UpdateExpression: UpdateExpression.join(" "),
    ExpressionAttributeValues,
    ExpressionAttributeNames,
    ReturnValues: "UPDATED_NEW"
  };

  console.log(params);
  return updateItem(params);
}

export const deleteItem = (params: DeleteItemInput) => {
  return promisify<DeleteItemOutput>((callback: Promise<DeleteItemOutput>) =>
    docClient.delete(params, callback)
  );
};
