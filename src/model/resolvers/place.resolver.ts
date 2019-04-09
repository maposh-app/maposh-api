import _ from "lodash";
import { Arg, Query, Resolver } from "type-graphql";
import * as db from "../../service/dynamo";
import { Place } from "../types/place.type";

@Resolver(() => Place)
export class PlaceResolver {
  @Query(() => Place, { nullable: true })
  public async getPlaceInfo(@Arg("placeID") placeID: string) {
    const placeInfo = await db.getByKey("Places", { placeID });
    return placeInfo.Item;
  }

  @Query(() => [Place], { nullable: true })
  public async getPlaces(@Arg("city") city: string) {
    const placeInfo = await db.queryIndex("Places", "top-city-places", {
      city: _.camelCase(city)
    });
    return placeInfo.Items;
  }
}
