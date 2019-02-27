import {
  QueryInput,
  QueryOutput,
  AttributeValue
} from "aws-sdk/clients/dynamodb";
import { FieldResolver, Resolver, Root, Query, Arg } from "type-graphql";
import {
  Review,
  TopUserReviewToken,
  TopUserReviewsConnection
} from "../types/review.type";
import { Place } from "../types/place.type";
import { User } from "../types/user.type";
// import { Place } from "../types/place.type";
import * as db from "../../service/dynamo";
import { TopUserReviewTokenInput } from "../types/review.input";

@Resolver(of => User)
export class UserResolver {
  @Query(returns => TopUserReviewsConnection, { nullable: true })
  async getPaginatedUserReviews(
    @Arg("handle") handle: string,
    @Arg("limit") limit?: number,
    @Arg("nextToken", { nullable: true }) nextToken?: TopUserReviewTokenInput
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
      const listOfReviews: TopUserReviewsConnection = {
        items: [] as [Review?]
      };

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
          } as TopUserReviewToken;
        }
      }

      return listOfReviews;
    });
  }

  @Query(returns => User)
  async getUserInfo(@Arg("handle") handle: string) {
    return db.getByKey("Users", { handle }).then(result => {
      return result.Item;
    });
  }

  @Query(returns => [Place], { nullable: true })
  async getUserFavourites(@Arg("handle") handle: string) {
    return db.getByKey("Users", { handle }, "favourites").then(result => {
      return result.Item
        ? (result.Item.favourites as [string]).map(async (place_id: string) => {
            const placeContainer = await db.getByKey("Places", { place_id });
            return placeContainer.Item;
          })
        : [];
    });
  }

  @FieldResolver(type => [Place], { nullable: true })
  async favourites(@Root() user: User) {
    return await this.getUserFavourites(user.handle);
  }

  @FieldResolver(type => TopUserReviewsConnection, { nullable: true })
  async reviews(@Root() user: User) {
    return await this.getPaginatedUserReviews(user.handle);
  }
}
