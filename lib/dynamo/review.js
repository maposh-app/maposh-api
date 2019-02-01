import uuid from "uuid/v1";
import * as db from "./dynamo";

const TableName = "Reviews";
const datetime = Date();

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

export function ReviewByAuthor(handle) {
  const params = {
    TableName,
    Key: {
      handle
    }
  };

  return db.get(params);
}

export function addReview(args) {
  const params = {
    TableName,
    Item: {
      review_id: uuid(),
      place_id: args.place_id,
      handle: args.handle,
      review: args.review,
      created_at: datetime.getTime()
    }
  };

  return db.createItem(params);
}

export function updateReviewUpvotes(args) {
  const params = {
    TableName,
    Key: {
      id: args.review_id
    },
    ExpressionAttributeValues: {
      ":upvote_count": args.upvote_count
    },
    UpdateExpression: "SET upvote_count = :upvote_count",
    ReturnValues: "ALL_NEW"
  };

  return db.updateItem(params, args);
}

export function deleteReview(args) {
  const params = {
    TableName,
    Key: {
      id: args.review_id
    }
  };

  return db.deleteItem(params, args);
}
