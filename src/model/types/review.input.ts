import { ReviewToken } from "./review.type";
import { InputType, Field, ID, Int } from "type-graphql";

@InputType()
export class ReviewTokenInput implements Partial<ReviewToken> {
  @Field(type => ID)
  review_id: string;

  @Field(type => Int)
  upvote_count: number;

  @Field()
  handle: string;
}
