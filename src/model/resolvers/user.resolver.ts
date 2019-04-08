import { AttributeValue } from "aws-sdk/clients/dynamodb";
import _ from "lodash";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from "type-graphql";
import * as db from "../../service/dynamo";
import { Context } from "../context";
import { Place } from "../types/place.type";
import { User } from "../types/user.type";

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  public async getUserInfo(@Arg("userID") userID: string) {
    const userInfo = await db.getByKey("Users", { userID });
    return userInfo.Item;
  }

  @Query(() => User, { nullable: true })
  public async meInfo(@Ctx() ctx: Context) {
    const userInfo = await db.getByKey("Users", { userID: ctx.userID });
    return userInfo.Item;
  }
  @Query(() => [Place], { nullable: true })
  public getUserFavourites(@Arg("userID") userID: string) {
    return this.getUserPlaceProp(userID, "favourites");
  }

  @Query(() => [Place], { nullable: true })
  public getUserDislikes(@Arg("userID") userID: string) {
    return this.getUserPlaceProp(userID, "dislikes");
  }

  @FieldResolver(() => [Place], { nullable: true })
  public favourites(@Root() user: User) {
    return this.getUserFavourites(user.userID);
  }

  @FieldResolver(() => [Place], { nullable: true })
  public dislikes(@Root() user: User) {
    return this.getUserDislikes(user.userID);
  }

  @Mutation(() => Boolean)
  public forget(@Ctx() ctx: Context, @Arg("placeID") placeID: string) {
    return db
      .deleteFromSetAttribute(
        "Users",
        { userID: ctx.userID },
        "dislikes",
        placeID
      )
      .then(() =>
        db.deleteFromSetAttribute(
          "Users",
          { userID: ctx.userID },
          "favourites",
          placeID
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

  @Mutation(() => Boolean)
  public like(
    @Ctx() ctx: Context,
    @Arg("placeID") placeID: string,
    @Arg("name") name: string,
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
            followers: [ctx.userID]
          },
          {
            name: _.camelCase(name) as AttributeValue,
            city: _.camelCase(city) as AttributeValue
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
  public dislike(@Ctx() ctx: Context, @Arg("placeID") placeID: string) {
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

  private async getUserPlaceProp(userID: string, prop: string) {
    const result = await db.getByKey("Users", { userID }, prop);
    return result.Item && result.Item[prop]
      ? (result.Item[prop] as any).values.map(async (placeID: string) => {
          const placeContainer = await db.getByKey("Places", { placeID });
          return placeContainer.Item;
        })
      : [];
  }
}
