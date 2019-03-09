import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import * as db from "../../service/dynamo";
import { Place } from "../types/place.type";
import { User } from "../types/user.type";

@Resolver(of => User)
export class UserResolver {
  @Query(returns => User)
  public async getUserInfo(@Arg("user_id") user_id: string) {
    return db.getByKey("Users", { user_id }).then(result => {
      return result.Item;
    });
  }

  @Query(returns => [Place], { nullable: true })
  public async getUserFavourites(@Arg("user_id") user_id: string) {
    return db.getByKey("Users", { user_id }, "favourites").then(result => {
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
    return this.getUserFavourites(user.user_id);
  }
}
