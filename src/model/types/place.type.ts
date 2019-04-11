import { Field, ID, Int, ObjectType, Float } from "type-graphql";

@ObjectType()
export class Place {
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

@ObjectType()
export class RankedPlaceToken {
  @Field(() => ID)
  public placeID: string;

  @Field(() => Int, { nullable: true })
  public upvoteCount: number;

  @Field(() => Float, { nullable: true })
  public longitude: number;

  @Field(() => Float, { nullable: true })
  public latitude: number;

  @Field()
  public name: string;

  @Field()
  public city: string;
}

@ObjectType()
export class TopCityPlacesConnection {
  @Field(() => [Place])
  public items: [Place?];

  @Field(() => RankedPlaceToken)
  public nextToken?: RankedPlaceToken;
}
