import { Field, ID, ObjectType, Int } from "type-graphql";

@ObjectType()
export class Review {
  @Field(type => ID)
  review_id: string;

  @Field()
  place_id: string;

  @Field()
  handle: string;

  @Field()
  review: string;

  @Field(type => Int)
  upvote_count: number;

  @Field()
  created_at: string;
}

@ObjectType()
export class TopUserReviewToken {
  @Field(type => ID)
  review_id: string;

  @Field(type => Int)
  upvote_count: number;

  @Field()
  handle: string;
}

@ObjectType()
export class TopUserReviewsConnection {
  @Field(type => [Review])
  items: [Review?];

  @Field(type => TopUserReviewToken)
  nextToken?: TopUserReviewToken;
}

@ObjectType()
export class TopPlaceReviewToken {
  @Field(type => ID)
  review_id: string;

  @Field(type => Int)
  upvote_count: number;

  @Field()
  place_id: string;
}

@ObjectType()
export class TopPlaceReviewsConnection {
  @Field(type => [Review])
  items: [Review?];

  @Field(type => TopPlaceReviewToken)
  nextToken?: TopPlaceReviewToken;
}
