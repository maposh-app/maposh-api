import { Field, ID, InputType, Int } from "type-graphql";
import { TopPlaceReviewToken, TopUserReviewToken } from "./review.type";

@InputType()
export class TopUserReviewTokenInput implements Partial<TopUserReviewToken> {
  @Field(type => ID)
  public review_id: string;

  @Field(type => Int)
  public upvote_count: number;

  @Field()
  public handle: string;
}

@InputType()
export class TopPlaceReviewTokenInput implements Partial<TopPlaceReviewToken> {
  @Field(type => ID)
  public review_id: string;

  @Field(type => Int)
  public upvote_count: number;

  @Field()
  public place_id: string;
}
