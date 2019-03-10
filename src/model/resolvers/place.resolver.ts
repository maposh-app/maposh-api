import {
  PutItemInput,
  PutItemInputAttributeMap
} from "aws-sdk/clients/dynamodb";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import * as db from "../../service/dynamo";
import { Context } from "../context";
import { Place } from "../types/place.type";

@Resolver(() => Place)
export class PlaceResolver {
  @Query(() => Place)
  public async getPlaceInfo(@Arg("placeID") placeID: string) {
    const placeInfo = await db.getByKey("Places", { placeID });
    return placeInfo.Item;
  }

  @Mutation(() => Place)
  public addPlace(
    @Ctx() ctx: Context,
    @Arg("placeID") placeID: string,
    @Arg("city") city: string
  ) {
    const newPlace: Place = {
      placeID,
      city,
      upvoteCount: 0,
      addedBy: ctx.userID
    };

    const params: PutItemInput = {
      TableName: "Places",
      Item: (newPlace as unknown) as PutItemInputAttributeMap
    };

    db.createItem(params);

    return newPlace;
  }

  @Mutation(() => Boolean)
  public upvotePlace(@Arg("placeID") placeID: string) {
    return db
      .incrementAttributes("Places", { placeID }, { upvoteCount: 1 })
      .then(() => true)
      .catch(() => false);
  }

  @Mutation(() => Boolean)
  public downvotePlace(@Arg("placeID") placeID: string) {
    return db
      .incrementAttributes("Places", { placeID }, { upvoteCount: -1 })
      .then(() => true)
      .catch(() => false);
  }
}
