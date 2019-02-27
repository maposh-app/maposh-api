import { AttributeValue, Key } from "aws-sdk/clients/dynamodb";

import uuid from "uuid/v1";
import * as db from "../../service/dynamo";

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

export function getPaginatedPlaceReviews(args) {
  const params = {
    TableName: "Reviews",
    KeyConditionExpression: "place_id = :v1",
    ExpressionAttributeValues: {
      ":v1": args.place_id
    },
    IndexName: "place-reviews",
    ScanIndexForward: false
  };

  if (args.limit) {
    params.Limit = args.limit;
  }

  if (args.nextToken) {
    params.ExclusiveStartKey = {
      review_id: args.nextToken.review_id,
      place_id: args.nextToken.place_id,
      created_at: args.nextToken.created_at
    };
  }

  return db.query(params).then(result => {
    const reviews = [];
    let listOfReviews;

    console.log(result);

    if (result.Items.length >= 1) {
      listOfReviews = {
        items: []
      };
    }

    for (let i = 0; i < result.Items.length; i += 1) {
      reviews.push({
        review_id: result.Items[i].review_id,
        place_id: result.Items[i].place_id,
        created_at: result.Items[i].created_at,
        handle: result.Items[i].handle,
        review: result.Items[i].review,
        upvote_count: result.Items[i].upvote_count
      });
    }

    listOfReviews.items = reviews;

    if (result.LastEvaluatedKey) {
      listOfReviews.nextToken = {
        review_id: result.LastEvaluatedKey.review_id,
        place_id: result.LastEvaluatedKey.place_id,
        created_at: result.LastEvaluatedKey.created_at,
        handle: result.LastEvaluatedKey.handle
      };
    }

    return listOfReviews;
  });
}
