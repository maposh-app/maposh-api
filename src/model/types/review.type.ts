import { Field, ID, ObjectType, Int } from "type-graphql";

@ObjectType()
export class Review {
  @Field(type => ID)
  review_id: string;

  @Field()
  place_id: string;

  @Field()
  review: string;

  @Field(type => Int)
  upvote_count: number;

  @Field()
  created_at: string;
}

`type Review {
  review_id: String!
  place_id: String!
  review: String!
  upvote_count: Int
  created_at: String!
}

type ReviewConnection {
  items: [Review!]!
  nextToken: Token
}

type Token {
  review_id: String!
  place_id: String!
  created_at: String!
  handle: String!
}
`;
