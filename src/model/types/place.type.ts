import { Field, ID, Int, ObjectType } from "type-graphql";
import { User } from "./user.type";

@ObjectType()
export class Place {
  @Field(() => ID)
  public placeID: string;

  @Field()
  public city: string;

  @Field(() => Int)
  public upvoteCount: number;

  @Field()
  public addedBy: string;

  @Field(() => [User], { nullable: true })
  public followers?: [User];
}

@ObjectType()
export class RankedPlaceToken {
  @Field(() => ID)
  public placeID: string;

  @Field(() => Int)
  public upvoteCount: number;

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
