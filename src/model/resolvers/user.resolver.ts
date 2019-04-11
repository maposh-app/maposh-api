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
  public getUserLikes(@Arg("userID") userID: string) {
    return this.getUserPlaceProp(userID, "likes");
  }

  @Query(() => [Place], { nullable: true })
  public getUserDislikes(@Arg("userID") userID: string) {
    return this.getUserPlaceProp(userID, "dislikes");
  }

  @FieldResolver(() => [Place], { nullable: true })
  public likes(@Root() user: User) {
    return this.getUserLikes(user.userID);
  }

  @FieldResolver(() => [Place], { nullable: true })
  public dislikes(@Root() user: User) {
    return this.getUserDislikes(user.userID);
  }

  @Mutation(() => Boolean)
  public forget(
    @Ctx() ctx: Context,
    @Arg("placeID") placeID: string,
    @Arg("score") score: number
  ) {
    return db
      .modifyAttributes("Users", { userID: ctx.userID }, undefined, undefined, {
        likes: [placeID],
        dislikes: [placeID]
      })
      .then(() =>
        db.modifyAttributes(
          "Places",
          { placeID },
          { upvoteCount: score },
          undefined,
          {
            likers: [ctx.userID],
            dislikers: [ctx.userID]
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
  public like(
    @Ctx() ctx: Context,
    @Arg("placeID") placeID: string,
    @Arg("name") name: string,
    @Arg("city") city: string,
    @Arg("longitude") longitude?: number,
    @Arg("latitude") latitude?: number,
    @Arg("extra") extra?: number
  ) {
    return db
      .modifyAttributes(
        "Users",
        { userID: ctx.userID },
        { likes: [placeID] },
        undefined,
        { dislikes: [placeID] }
      )
      .then(() =>
        db.modifyAttributes(
          "Places",
          { placeID },
          {
            likers: [ctx.userID],
            upvoteCount: extra ? extra + 1 : 1
          },
          {
            name: name as AttributeValue,
            city: _.camelCase(city) as AttributeValue,
            longitude: longitude as AttributeValue,
            latitude: latitude as AttributeValue
          },
          {
            dislikers: [ctx.userID]
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
  public dislike(
    @Ctx() ctx: Context,
    @Arg("placeID") placeID: string,
    @Arg("name") name: string,
    @Arg("city") city: string,
    @Arg("longitude") longitude?: number,
    @Arg("latitude") latitude?: number,
    @Arg("extra") extra?: number
  ) {
    return db
      .modifyAttributes(
        "Users",
        { userID: ctx.userID },
        { dislikes: [placeID] },
        undefined,
        { likes: [placeID] }
      )
      .then(() =>
        db.modifyAttributes(
          "Places",
          { placeID },
          {
            dislikers: [ctx.userID],
            upvoteCount: extra ? extra - 1 : -1
          },
          {
            name: name as AttributeValue,
            city: _.camelCase(city) as AttributeValue,
            longitude: longitude as AttributeValue,
            latitude: latitude as AttributeValue
          },
          {
            likers: [ctx.userID]
          }
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
