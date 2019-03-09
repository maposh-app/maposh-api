import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field(type => ID)
  public handle: string;

  @Field(type => ID)
  public user_id: string;

  @Field()
  public name: string;

  @Field()
  public location: string;

  @Field()
  public created_at: string;

  @Field({ nullable: true })
  public description?: string;
}
