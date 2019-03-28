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
  @Query(() => User)
  public async getUserInfo(@Arg("userID") userID: string) {
    const userInfo = await db.getByKey("Users", { userID });
    return userInfo.Item;
  }

  @Query(() => User)
  public async meInfo(@Ctx() ctx: Context) {
    const userInfo = await db.getByKey("Users", { userID: ctx.userID });
    return userInfo.Item;
  }

  @Query(() => [Place], { nullable: true })
  public async getUserFavourites(@Arg("userID") userID: string) {
    const result = await db.getByKey("Users", { userID }, "favourites");
    // if (result.Item) {
    //   console.log((result.Item.favourites as Set<string>).values);
    // }
    return result.Item && result.Item.favourites
      ? (result.Item.favourites as any).values.map(async (placeID: string) => {
          const placeContainer = await db.getByKey("Places", { placeID });
          return placeContainer.Item;
        })
      : [];
  }

  @FieldResolver(() => [Place], { nullable: true })
  public favourites(@Root() user: User) {
    return this.getUserFavourites(user.userID);
  }

  @Mutation(() => Boolean)
  public addFavourite(@Ctx() ctx: Context, @Arg("placeID") placeID: string) {
    return db
      .appendToAttributes(
        "Users",
        { userID: ctx.userID },
        { favourites: [placeID] }
      )
      .then(() => true)
      .catch(() => false);
  }
}
