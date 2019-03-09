import { Field, Float, ID, Int, ObjectType } from "type-graphql";
import { User } from "./user.type";

@ObjectType()
export class Place {
  @Field(type => ID)
  public place_id: string;

  @Field()
  public name: string;

  @Field()
  public city: string;

  @Field(type => Int)
  public upvote_count: number;

  @Field()
  public added_by: string;

  @Field(type => [User], { nullable: true })
  public followers?: [User];
}

@ObjectType()
export class RankedPlaceToken {
  @Field(type => ID)
  public place_id: string;

  @Field(type => Int)
  public upvote_count: number;

  @Field()
  public city: string;
}

@ObjectType()
export class TopCityPlacesConnection {
  @Field(type => [Place])
  public items: [Place?];

  @Field(type => RankedPlaceToken)
  public nextToken?: RankedPlaceToken;
}
