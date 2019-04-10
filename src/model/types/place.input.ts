import { Field, ID, InputType, Int, Float } from "type-graphql";
import { RankedPlaceToken } from "./place.type";

@InputType()
export class RankedPlaceTokenInput implements Partial<RankedPlaceToken> {
  @Field(() => ID)
  public placeID: string;

  @Field()
  public name: string;

  @Field()
  public city: string;

  @Field(() => Int, { nullable: true })
  public upvoteCount: number;

  @Field(() => Float, { nullable: true })
  public longitude: number;

  @Field(() => Float, { nullable: true })
  public latitude: number;
}
