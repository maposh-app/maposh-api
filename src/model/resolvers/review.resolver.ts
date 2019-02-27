import { Key, PutItemInput, PutItemOutput } from "aws-sdk/clients/dynamodb";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import uuid from "uuid/v1";
import * as db from "../../service/dynamo";
import { Context } from "../context";
import { Review } from "../types/review.type";

@Resolver(of => Review)
export class ReviewResolver {
  @Mutation(() => Review)
  public addReview(
    @Ctx() ctx: Context,
    @Arg("review_title") review_title: string,
    @Arg("place_id") place_id: string,
    @Arg("review", { nullable: true }) review?: string
  ): Review {
    const datetime = new Date();

    const newReview: Review = {
      created_at: datetime.toISOString(),
      place_id,
      review_id: uuid(),
      review_title,
      review: review || "",
      upvote_count: 0,
      user_id: ctx.user_id
    };

    const params = {
      TableName: "Reviews",
      Item: newReview
    } as unknown;

    db.createItem(params as PutItemInput).catch(err => console.log(err));
    return newReview;
  }
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
    TableName: "Reviews",
    Key: {
      id: review_id
    }
  };

  return db.deleteItem(params);
}
