import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Review {
  @Field(type => ID)
  public review_id: string;

  @Field()
  public place_id: string;

  @Field()
  public user_id: string;

  @Field(type => String, { nullable: true })
  public review_title?: string;

  @Field()
  public review: string;

  @Field(type => Int)
  public upvote_count: number;

  @Field()
  public created_at: string;
}

@ObjectType()
export class TopUserReviewToken {
  @Field(type => ID)
  public review_id: string;

  @Field(type => Int)
  public upvote_count: number;

  @Field()
  public user_id: string;
}

@ObjectType()
export class TopUserReviewsConnection {
  @Field(type => [Review])
  public items: [Review?];

  @Field(type => TopUserReviewToken)
  public nextToken?: TopUserReviewToken;
}

@ObjectType()
export class TopPlaceReviewToken {
  @Field(type => ID)
  public review_id: string;

  @Field(type => Int)
  public upvote_count: number;

  @Field()
  public place_id: string;
}

@ObjectType()
export class TopPlaceReviewsConnection {
  @Field(type => [Review])
  public items: [Review?];

  @Field(type => TopPlaceReviewToken)
  public nextToken?: TopPlaceReviewToken;
}
