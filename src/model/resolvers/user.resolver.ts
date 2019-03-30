import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";
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
