import { RankedPlaceToken } from "./place.type";
import { InputType, Field, ID, Int } from "type-graphql";

@InputType()
export class RankedPlaceTokenInput implements Partial<RankedPlaceToken> {
  @Field(type => ID)
  place_id: string;

  @Field(type => Int)
  rank: number;

  @Field()
  city: string;
}
