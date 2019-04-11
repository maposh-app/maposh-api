import { AttributeValue, GetItemOutput } from "aws-sdk/clients/dynamodb";
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
  public like(
    @Ctx() ctx: Context,
    @Arg("placeID") placeID: string,
    @Arg("name") name: string,
    @Arg("city") city: string,
    @Arg("longitude") longitude?: number,
    @Arg("latitude") latitude?: number
  ) {
    return db
      .getByKey("Users", { userID: ctx.userID })
      .then((info: GetItemOutput) => {
        console.log("USER INFO:", info);
        const userInfo: {
          userID?: string;
          likes?: Set<string>;
          dislikes?: Set<string>;
        } = {};
        if (info.Item && info.Item.userID) {
          userInfo.userID = info.Item.userID as string;
        }
        if (info.Item && info.Item.likes) {
          userInfo.likes = new Set<string>((info.Item.likes as any)
            .values as string[]);
        }
        if (info.Item && info.Item.dislikes) {
          userInfo.dislikes = new Set<string>((info.Item.dislikes as any)
            .values as string[]);
        }
        return userInfo;
      })
      .then(user => {
        let shouldAddToLikes = true;
        let shouldRemoveFromDislikes = false;
        if (user.likes && user.likes.has(placeID)) {
          shouldAddToLikes = false;
        }
        if (user.dislikes && user.dislikes.has(placeID)) {
          shouldRemoveFromDislikes = true;
        }
        db.modifyAttributes(
          "Users",
          { userID: ctx.userID },
          {
            likes: shouldAddToLikes ? [placeID] : []
          },
          undefined,
          {
            likes: !shouldAddToLikes ? [placeID] : [],
            dislikes: shouldRemoveFromDislikes ? [placeID] : []
          }
        ).catch(err => {
          console.log("USER UPDATE ERROR:", err);
          throw err;
        });
        return { shouldAddToLikes, shouldRemoveFromDislikes };
      })
      .then(({ shouldAddToLikes, shouldRemoveFromDislikes }) => {
        return db.modifyAttributes(
          "Places",
          { placeID },
          {
            likers: shouldAddToLikes ? [ctx.userID] : [],
            upvoteCount: !shouldAddToLikes
              ? -1
              : 1 + Number(shouldRemoveFromDislikes)
          },
          {
            name: name as AttributeValue,
            city: _.camelCase(city) as AttributeValue,
            longitude: longitude as AttributeValue,
            latitude: latitude as AttributeValue
          },
          {
            dislikers: shouldRemoveFromDislikes ? [ctx.userID] : []
          }
        );
      })
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
    @Arg("latitude") latitude?: number
  ) {
    return db
      .getByKey("Users", { userID: ctx.userID })
      .then((info: GetItemOutput) => {
        console.log("USER INFO:", info);
        const userInfo: {
          userID?: string;
          likes?: Set<string>;
          dislikes?: Set<string>;
        } = {};
        if (info.Item && info.Item.userID) {
          userInfo.userID = info.Item.userID as string;
        }
        if (info.Item && info.Item.likes) {
          userInfo.likes = new Set<string>((info.Item.likes as any)
            .values as string[]);
        }
        if (info.Item && info.Item.dislikes) {
          userInfo.dislikes = new Set<string>((info.Item.dislikes as any)
            .values as string[]);
        }
        return userInfo;
      })
      .then(user => {
        let shouldAddToDislikes = true;
        let shouldRemoveFromLikes = false;
        if (user.dislikes && user.dislikes.has(placeID)) {
          shouldAddToDislikes = false;
        }
        if (user.likes && user.likes.has(placeID)) {
          shouldRemoveFromLikes = true;
        }
        db.modifyAttributes(
          "Users",
          { userID: ctx.userID },
          {
            dislikes: shouldAddToDislikes ? [placeID] : []
          },
          undefined,
          {
            dislikes: !shouldAddToDislikes ? [placeID] : [],
            likes: shouldRemoveFromLikes ? [placeID] : []
          }
        ).catch(err => {
          console.log("USER UPDATE ERROR:", err);
          throw err;
        });
        return {
          shouldAddToDislikes,
          shouldRemoveFromLikes
        };
      })
      .then(({ shouldAddToDislikes, shouldRemoveFromLikes }) => {
        return db.modifyAttributes(
          "Places",
          { placeID },
          {
            dislikers: shouldAddToDislikes ? [ctx.userID] : [],
            upvoteCount: !shouldAddToDislikes
              ? 1
              : -1 - Number(shouldRemoveFromLikes)
          },
          {
            name: name as AttributeValue,
            city: _.camelCase(city) as AttributeValue,
            longitude: longitude as AttributeValue,
            latitude: latitude as AttributeValue
          },
          {
            likers: shouldRemoveFromLikes ? [ctx.userID] : []
          }
        );
      })
      .then(() => true)
      .catch(err => {
        console.log(err);
        return err;
      });
  }

  private async getUserPlaceProp(userID: string, prop: string) {
    const result = await db.getByKey("Users", { userID });
    console.log("USER DATA", result);
    return result.Item && result.Item[prop]
      ? (result.Item[prop] as any).values.map(async (placeID: string) => {
          const placeContainer = await db.getByKey("Places", { placeID });
          return placeContainer.Item;
        })
      : [];
  }
}
