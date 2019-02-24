import { Key, AttributeValue } from "aws-sdk/clients/dynamodb";
import uuid from "uuid/v1";
import * as db from "./dynamo";

const TableName = "Reviews";
const datetime = new Date();

export function getReviews() {
  const params = {
    TableName,
    AttributesToGet: [
      "handle",
      "review_id",
      "place_id",
      "upvote_count",
      "created_at"
    ]
  };

  return db.scan(params);
}

export function getReviewsByAuthor(handle: Key) {
  const params = {
    TableName,
    IndexName: "top-user-reviews",
    KeyConditionExpression: "handle = :handle",
    ExpressionAttributeValues: {
      ":handle": handle
    }
  };

  return db.query(params);
}

export function getReviewAttributes(
  review_id: Key,
  ...attributes: AttributeValue[]
) {
  const params = {
    TableName,
    Key: {
      review_id
    },
    ProjectionExpression: attributes.join()
  };

  return db.get(params);
}

export function addReview(args: { [property: string]: AttributeValue }) {
  const params = {
    TableName,
    Item: {
      review_id: uuid() as AttributeValue,
      place_id: args.place_id,
      handle: args.handle,
      review: args.review,
      created_at: datetime.getTime() as AttributeValue
    }
  };

  return db.createItem(params);
}

// export function downvoteReview(review_id: Key) {

//   const params = {
//     TableName,
//     Key: {
//       id: review_id
//     },
//     ExpressionAttributeValues: {
//       ":upvote_count": args.upvote_count
//     },
//     UpdateExpression: "SET upvote_count = :upvote_count",
//     ReturnValues: "ALL_NEW"
//   };

//   return db.updateItem(params);
// }

export function deleteReview(review_id: Key) {
  const params = {
    TableName,
    Key: {
      id: review_id
    }
  };

  return db.deleteItem(params);
}