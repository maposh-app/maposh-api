import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID, { nullable: true })
  public handle: string;

  @Field(() => ID)
  public userID: string;

  @Field({ nullable: true })
  public firstName: string;

  @Field({ nullable: true })
  public lastName: string;

  @Field({ nullable: true })
  public location: string;

  @Field({ nullable: true })
  public description?: string;
}
