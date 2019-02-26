import { Field, ID, ObjectType, Int, Float } from "type-graphql";
import { ReviewConnection } from "./review.type";
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
  reviews?: ReviewConnection;
}
