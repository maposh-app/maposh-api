import {
  AttributeValue,
  Key,
  QueryInput,
  QueryOutput
} from "aws-sdk/clients/dynamodb";
import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import * as db from "../../service/dynamo";
import { Place } from "../types/place.type";
import { TopUserReviewTokenInput } from "../types/review.input";
import {
  Review,
  TopUserReviewsConnection,
  TopUserReviewToken
} from "../types/review.type";
import { User } from "../types/user.type";

@Resolver(of => User)
export class UserResolver {
  @Query(returns => TopUserReviewsConnection, { nullable: true })
  public async getPaginatedUserReviews(
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
      params.ExclusiveStartKey = (nextToken as unknown) as Key;
    }
    return db.query(params).then((result: QueryOutput) => {
      const listOfReviews: TopUserReviewsConnection = {
        items: [] as [Review?]
      };

      if (result.Items && result.Items.length >= 1) {
        for (const review of result.Items) {
          listOfReviews.items.push((review as unknown) as Review);
        }
        const token = result.LastEvaluatedKey as unknown;
        if (token) {
          listOfReviews.nextToken = token as TopUserReviewToken;
        }
      }

      return listOfReviews;
    });
  }

  @Query(returns => User)
  public async getUserInfo(@Arg("handle") handle: string) {
    return db.getByKey("Users", { handle }).then(result => {
      return result.Item;
    });
  }

  @Query(returns => [Place], { nullable: true })
  public async getUserFavourites(@Arg("handle") handle: string) {
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
  public async favourites(@Root() user: User) {
    return this.getUserFavourites(user.handle);
  }

  @FieldResolver(type => TopUserReviewsConnection, { nullable: true })
  public async reviews(@Root() user: User) {
    return this.getPaginatedUserReviews(user.handle);
  }
}
