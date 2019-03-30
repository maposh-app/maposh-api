import { AttributeValue } from "aws-sdk/clients/dynamodb";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import * as db from "../../service/dynamo";
import { Context } from "../context";
import { Place } from "../types/place.type";

@Resolver(() => Place)
export class PlaceResolver {
  @Query(() => Place, { nullable: true })
  public async getPlaceInfo(@Arg("placeID") placeID: string) {
    const placeInfo = await db.getByKey("Places", { placeID });
    return placeInfo.Item;
  }

  @Mutation(() => Boolean)
  public upvotePlace(
    @Ctx() ctx: Context,
    @Arg("placeID") placeID: string,
    @Arg("city") city: string
  ) {
    return db
      .modifyAttributes(
        "Users",
        { userID: ctx.userID },
        { favourites: [placeID] }
      )
      .then(() => {
        db.deleteFromSetAttribute(
          "Users",
          { userID: ctx.userID },
          "dislikes",
          placeID
        );
      })
      .then(() =>
        db.modifyAttributes(
          "Places",
          { placeID },
          {
            upvoteCount: 1,
            followers: [ctx.userID]
          },
          {
            city: city as AttributeValue
          }
        )
      )
      .then(() => true)
      .catch(err => {
        console.log(err);
        return err;
      });
  }

  @Mutation(() => Boolean)
  public downvotePlace(
    @Ctx() ctx: Context,
    @Arg("placeID") placeID: string,
    @Arg("city") city: string
  ) {
    return db
      .modifyAttributes(
        "Users",
        { userID: ctx.userID },
        { dislikes: [placeID] }
      )
      .then(() => {
        db.deleteFromSetAttribute(
          "Users",
          { userID: ctx.userID },
          "favourites",
          placeID
        );
      })
      .then(() =>
        db.modifyAttributes(
          "Places",
          { placeID },
          { upvoteCount: -1 },
          {
            city: city as AttributeValue
          }
        )
      )
      .then(() =>
        db.deleteFromSetAttribute(
          "Places",
          { placeID },
          "followers",
          ctx.userID
        )
      )
      .then(() => true)
      .catch(err => {
        console.log(err);
        return err;
      });
  }
}
