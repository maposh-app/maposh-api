const schema = `
type Mutation {
    # Create a user review
    createReview(
        review_id: String!,
        review: String!,
        consumer_key: String,
        consumer_secret: String,
        access_token_key: String,
        access_token_secret: String,
        created_at: String!
    ): Review!

    # Delete the user review
    deleteReview(
        review_id: String!,
        consumer_key: String,
        consumer_secret: String,
        access_token_key: String,
        access_token_secret: String
    ): Review!

    # Update the existing review
    updateReview(review_id: String!, review: String!): Review!

    updateUserInfo(
        location: String!,
        description: String!,
        name: String!,
        favourites: [String!]!
    ): User!
}

type Query {
    meInfo(consumer_key: String, consumer_secret: String): User!
    getUserInfo(handle: String!, consumer_key: String, consumer_secret: String): User!

    # search functionality is available in elasticsearch integration
    searchAllReviewsByKeyword(keyword: String!): ReviewConnection
}

directive @aws_subscribe(mutations: [String]) on FIELD_DEFINITION

type Subscription {
    addReview: Review
        @aws_subscribe(mutations: ["createReview"])
}

type Review {
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

input TokenInput {
    review_id : String!
    place_id : String!
    created_at: String!
    handle: String!
}

type Token {
    review_id : String!
    place_id : String!
    created_at: String!
    handle: String!
}

type User {
    name: String!
    handle: String!
    location: String!
    description: String!
    favourites: [String!]!
    topReview: Review
    reviews(limit: Int, nextToken: TokenInput): ReviewConnection

    searchReviewsByKeyword(keyword: String!): ReviewConnection
}

type Place {
    name: String!
    place_id: String!
    address: String!
    description: String!
    followers: [String!]!
    city: String!
    state: String!
    rank: Int!
    latitude: Int!
    longitude: Int!
    topReview: Review
    reviews(limit: Int, nextToken: TokenInput): ReviewConnection

    searchReviewsByKeyword(keyword: String!): ReviewConnection
}

schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
}`;

// eslint-disable-next-line import/prefer-default-export
export { schema };
