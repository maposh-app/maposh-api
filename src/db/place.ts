import { Key, AttributeValue } from "aws-sdk/clients/dynamodb";

import uuid from "uuid/v1";
import * as db from "./dynamo";

const TableName = "Places";
const datetime = new Date();

export function getPlaces() {
  const params = {
    TableName,
    AttributesToGet: [
      "place_id",
      "name",
      "address",
      "city",
      "state",
      "rank",
      "latitude",
      "longitude",
      "created_at"
    ]
  };

  return db.scan(params);
}

export function getPlaceById(place_id: Key) {
  const params = {
    TableName,
    Key: {
      place_id
    }
  };

  return db.get(params);
}

export function addPlace(args: { [property: string]: AttributeValue }) {
  const params = {
    TableName,
    Item: {
      place_id: uuid() as AttributeValue,
      name: args.name,
      address: args.address,
      city: args.city,
      state: args.state,
      rank: args.rank,
      latitude: args.latitude,
      longitude: args.longitude,
      modified_at: datetime.getTime() as AttributeValue
    }
  };

  return db.createItem(params);
}

export function updatePlaceRank(place_id: Key, rank: AttributeValue) {
  const params = {
    TableName,
    Key: {
      id: place_id
    },
    ExpressionAttributeValues: {
      ":rank": rank
    },
    UpdateExpression: "SET rank = :rank",
    ReturnValues: "ALL_NEW"
  };

  return db.updateItem(params);
}

export function deletePlace(place_id: Key) {
  const params = {
    TableName,
    Key: {
      id: place_id
    }
  };

  return db.deleteItem(params);
}
