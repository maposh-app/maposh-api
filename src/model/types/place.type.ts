import { Field, Float, ID, Int, ObjectType } from "type-graphql";
import { TopPlaceReviewsConnection } from "./review.type";
import { User } from "./user.type";

@ObjectType()
export class Place {
  @Field(type => ID)
  public place_id: string;

  @Field()
  public name: string;

  @Field()
  public address: string;

  @Field()
  public city: string;

  @Field()
  public state: string;

  @Field()
  public added_by: string;

  @Field(type => Int)
  public rank: number;

  @Field(type => Float)
  public latitude: number;

  @Field(type => Float)
  public longitude: number;

  @Field({ nullable: true })
  public description?: string;

  @Field(type => [User], { nullable: true })
  public followers?: [User];

  @Field({ nullable: true })
  public reviews?: TopPlaceReviewsConnection;
}

@ObjectType()
export class RankedPlaceToken {
  @Field(type => ID)
  public place_id: string;

  @Field(type => Int)
  public rank: number;

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
