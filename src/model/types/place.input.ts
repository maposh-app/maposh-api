import { Field, ID, InputType, Int } from "type-graphql";
import { RankedPlaceToken } from "./place.type";

@InputType()
export class RankedPlaceTokenInput implements Partial<RankedPlaceToken> {
  @Field(() => ID)
  public placeID: string;

  @Field()
  public city: string;

  @Field(() => Int)
  public upvoteCount: number;
}
