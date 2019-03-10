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

  @Query(() => [Place], { nullable: true })
  public async getUserFavourites(@Arg("userID") userID: string) {
    const result = await db.getByKey("Users", { userID }, "favourites");
    return result.Item
      ? (result.Item.favourites as [string]).map(async (place_id: string) => {
          const placeContainer = await db.getByKey("Places", { place_id });
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
    db.appendToAttributes(
      "Users",
      { userID: ctx.userID },
      { favourites: [placeID] }
    )
      .then(() => true)
      .catch(() => false);
  }
}
