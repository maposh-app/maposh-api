import { Field, ID, ObjectType, Int, Float } from "type-graphql";
import { TopPlaceReviewsConnection } from "./review.type";
import { User } from "./user.type";

@ObjectType()
export class Place {
  @Field(type => ID)
  place_id: string;

  @Field()
  name: string;

  @Field()
  address: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field(type => Int)
  rank: number;

  @Field(type => Float)
  latitude: number;

  @Field(type => Float)
  longitude: number;

  @Field({ nullable: true })
  description?: string;

  @Field(type => [User], { nullable: true })
  followers?: [User];

  @Field({ nullable: true })
  reviews?: TopPlaceReviewsConnection;
}

@ObjectType()
export class RankedPlaceToken {
  @Field(type => ID)
  place_id: string;

  @Field(type => Int)
  rank: number;

  @Field()
  city: string;
}

@ObjectType()
export class TopCityPlacesConnection {
  @Field(type => [Place])
  items: [Place?];

  @Field(type => RankedPlaceToken)
  nextToken?: RankedPlaceToken;
}