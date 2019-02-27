import { Field, ID, InputType, Int } from "type-graphql";
import { RankedPlaceToken } from "./place.type";

@InputType()
export class RankedPlaceTokenInput implements Partial<RankedPlaceToken> {
  @Field(type => ID)
  public place_id: string;

  @Field(type => Int)
  public rank: number;

  @Field()
  public city: string;
}
