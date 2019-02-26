// import { Place } from "./place.type";
import { ReviewConnection } from "./review.type";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field(type => ID)
  handle: string;

  @Field()
  name: string;

  @Field()
  location: string;

  @Field()
  created_at: string;

  @Field({ nullable: true })
  description?: string;

  //   @Field(type => [Place], { nullable: true })
  //   favourites?: [Place];

  @Field(type => ReviewConnection, { nullable: true })
  reviews?: ReviewConnection;
}
