import { AttributeValue } from "aws-sdk/clients/dynamodb";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
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
    const placeInfo = await db.queryIndex("Places", "TopCityPlaces", { city });
    return placeInfo.Items;
  }

  @Mutation(() => Boolean)
  public ratePlace(
    @Arg("placeID") placeID: string,
    @Arg("city") city: string,
    @Arg("score") score: number
  ) {
    return db
      .modifyAttributes(
        "Places",
        { placeID },
        {
          upvoteCount: score
        },
        {
          city: city as AttributeValue
        }
      )
      .then(() => true)
      .catch(err => {
        console.log(err);
        return err;
      });
  }
}
