import { Field, ID, InputType, Int } from "type-graphql";
import { Review, TopPlaceReviewToken, TopUserReviewToken } from "./review.type";

@InputType()
export class AddReviewInput implements Partial<Review> {
  @Field()
  public review_title: string;

  @Field(type => String, { nullable: true })
  public review?: string;
}

@InputType()
export class TopUserReviewTokenInput implements Partial<TopUserReviewToken> {
  @Field(type => ID)
  public review_id: string;

  @Field(type => Int)
  public upvote_count: number;

  @Field()
  public user_id: string;
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
