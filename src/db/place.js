import uuid from "uuid/v1";
import * as db from "./dynamo";

const TableName = "Places";
const datetime = Date();

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

export function PlaceById(place_id) {
  const params = {
    TableName,
    Key: {
      place_id
    }
  };

  return db.get(params);
}

export function addPlace(args) {
  const params = {
    TableName,
    Item: {
      place_id: uuid(),
      name: args.name,
      address: args.address,
      city: args.city,
      state: args.state,
      rank: args.rank,
      latitude: args.latitude,
      longitude: args.longitude,
      modified_at: datetime.getTime()
    }
  };

  return db.createItem(params);
}

export function updatePlaceRank(args) {
  const params = {
    TableName,
    Key: {
      id: args.place_id
    },
    ExpressionAttributeValues: {
      ":rank": args.rank
    },
    UpdateExpression: "SET rank = :rank",
    ReturnValues: "ALL_NEW"
  };

  return db.updateItem(params, args);
}

export function deletePlace(args) {
  const params = {
    TableName,
    Key: {
      id: args.place_id
    }
  };

  return db.deleteItem(params, args);
}
