import { TopUserReviewToken, TopPlaceReviewToken } from "./review.type";
import { InputType, Field, ID, Int } from "type-graphql";

@InputType()
export class TopUserReviewTokenInput implements Partial<TopUserReviewToken> {
  @Field(type => ID)
  review_id: string;

  @Field(type => Int)
  upvote_count: number;

  @Field()
  handle: string;
}

@InputType()
export class TopPlaceReviewTokenInput implements Partial<TopPlaceReviewToken> {
  @Field(type => ID)
  review_id: string;

  @Field(type => Int)
  upvote_count: number;

  @Field()
  place_id: string;
}
