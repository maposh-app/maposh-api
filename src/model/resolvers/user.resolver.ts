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
    const favourites = await db.getByKey("Users", { userID }, "favourites");
    return favourites;
  }

  @Mutation(() => User)
  public async addFavourite(
    @Ctx() ctx: Context,
    @Arg("placeID") placeID: string
  ) {
    const newUser = await db.appendToAttributes(
      "Users",
      { userID: ctx.userID },
      { favourites: [placeID] }
    );
    return newUser;
  }

  @FieldResolver(() => [Place], { nullable: true })
  public async favourites(@Root() user: User) {
    return this.getUserFavourites(user.userID);
  }
}
