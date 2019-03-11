import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID)
  public handle: string;

  @Field(() => ID)
  public userID: string;

  @Field()
  public firstName: string;

  @Field()
  public lastName: string;

  @Field()
  public location: string;

  @Field()
  public created_at: string;

  @Field({ nullable: true })
  public description?: string;
}
