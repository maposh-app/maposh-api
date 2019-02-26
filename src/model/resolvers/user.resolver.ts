import {
  QueryInput,
  QueryOutput,
  AttributeValue
} from "aws-sdk/clients/dynamodb";
import { Resolver, Query, Arg } from "type-graphql";
import { Review, ReviewToken, ReviewConnection } from "../types/review.type";
import { User } from "../types/user.type";
import * as db from "../../service/dynamo";
import { ReviewTokenInput } from "../types/review.input";

@Resolver(of => User)
export class UserResolver {
  @Query(returns => ReviewConnection, { nullable: true })
  async getPaginatedUserReviews(
    @Arg("handle") handle: string,
    @Arg("limit") limit?: number,
    @Arg("nextToken", { nullable: true }) nextToken?: ReviewTokenInput
  ) {
    const params: QueryInput = {
      TableName: "Reviews",
      KeyConditionExpression: "handle = :v1",
      ExpressionAttributeValues: {
        ":v1": handle as AttributeValue
      },
      IndexName: "top-user-reviews",
      ScanIndexForward: false
    };

    if (limit) {
      params.Limit = limit;
    }

    if (nextToken) {
      params.ExclusiveStartKey = {
        review_id: nextToken.review_id as AttributeValue,
        handle: nextToken.handle as AttributeValue,
        upvote_count: nextToken.upvote_count as AttributeValue
      };
    }
    return db.query(params).then((result: QueryOutput) => {
      const listOfReviews: ReviewConnection = { items: [] as [Review?] };

      console.log(result);

      if (result.Items && result.Items.length >= 1) {
        for (let i = 0; i < result.Items.length; i += 1) {
          listOfReviews.items.push({
            review_id: result.Items[i].review_id,
            place_id: result.Items[i].place_id,
            created_at: result.Items[i].created_at,
            handle: result.Items[i].handle,
            review: result.Items[i].review,
            upvote_count: result.Items[i].upvote_count
          } as Review);
        }

        if (result.LastEvaluatedKey) {
          listOfReviews.nextToken = {
            review_id: result.LastEvaluatedKey.review_id,
            handle: result.LastEvaluatedKey.handle,
            upvote_count: result.LastEvaluatedKey.upvote_count
          } as ReviewToken;
        }
      }

      return listOfReviews;
    });
  }

  @Query(returns => [User], { nullable: true })
  async getUserInfo(@Arg("handle") handle: string) {
    db.query({
      TableName: "Users",
      KeyConditionExpression: "handle = :v1",
      ExpressionAttributeValues: {
        ":v1": handle as AttributeValue
      }
    }).then(result => {
      return result.Items ? result.Items[0] : null;
    });
  }
}
