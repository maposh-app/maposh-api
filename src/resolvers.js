import { promisify } from "../utils/helpers";
import { query } from "./service/dynamo";

const data = {
  getPaginatedUserReviews(args) {
    const params = {
      TableName: "Reviews",
      KeyConditionExpression: "handle = :v1",
      ExpressionAttributeValues: {
        ":v1": args.handle
      },
      IndexName: "top-user-reviews",
      ScanIndexForward: false
    };

    if (args.limit) {
      params.Limit = args.limit;
    }

    if (args.nextToken) {
      params.ExclusiveStartKey = {
        review_id: args.nextToken.review_id,
        place_id: args.nextToken.place_id,
        created_at: args.nextToken.created_at,
        handle: handle
      };
    }
    return query(params).then(result => {
      const reviews = [];
      let listOfReviews;

      console.log(result);

      if (result.Items.length >= 1) {
        listOfReviews = {
          items: []
        };
      }

      for (let i = 0; i < result.Items.length; i += 1) {
        reviews.push({
          review_id: result.Items[i].review_id,
          place_id: result.Items[i].place_id,
          created_at: result.Items[i].created_at,
          handle: result.Items[i].handle,
          review: result.Items[i].review,
          upvote_count: result.Items[i].upvote_count
        });
      }

      listOfReviews.items = reviews;

      if (result.LastEvaluatedKey) {
        listOfReviews.nextToken = {
          review_id: result.LastEvaluatedKey.review_id,
          place_id: result.LastEvaluatedKey.place_id,
          created_at: result.LastEvaluatedKey.created_at,
          handle: result.LastEvaluatedKey.handle
        };
      }

      return listOfReviews;
    });
  },

  getPaginatedPlaceReviews(args) {
    const params = {
      TableName: "Reviews",
      KeyConditionExpression: "place_id = :v1",
      ExpressionAttributeValues: {
        ":v1": args.place_id
      },
      IndexName: "place-reviews",
      ScanIndexForward: false
    };

    if (args.limit) {
      params.Limit = args.limit;
    }

    if (args.nextToken) {
      params.ExclusiveStartKey = {
        review_id: args.nextToken.review_id,
        place_id: args.nextToken.place_id,
        created_at: args.nextToken.created_at,
        place_id: place_id
      };
    }
    return query(params).then(result => {
      const reviews = [];
      let listOfReviews;

      console.log(result);

      if (result.Items.length >= 1) {
        listOfReviews = {
          items: []
        };
      }

      for (let i = 0; i < result.Items.length; i += 1) {
        reviews.push({
          review_id: result.Items[i].review_id,
          place_id: result.Items[i].place_id,
          created_at: result.Items[i].created_at,
          handle: result.Items[i].handle,
          review: result.Items[i].review,
          upvote_count: result.Items[i].upvote_count
        });
      }

      listOfReviews.items = reviews;

      if (result.LastEvaluatedKey) {
        listOfReviews.nextToken = {
          review_id: result.LastEvaluatedKey.review_id,
          place_id: result.LastEvaluatedKey.place_id,
          created_at: result.LastEvaluatedKey.created_at,
          handle: result.LastEvaluatedKey.handle
        };
      }

      return listOfReviews;
    });
  },

  getUserInfo(args) {
    query({
      TableName: "Users",
      KeyConditionExpression: "handle = :v1",
      ExpressionAttributeValues: {
        ":v1": args.handle
      }
    }).then(result => {
      let listOfReviews;

      if (result.Items.length >= 1) {
        listOfReviews = {
          name: result.Items[0].name,
          handle: result.Items[0].handle,
          location: result.Items[0].location,
          description: result.Items[0].description,
          favourites: result.Items[0].favourites
        };
      }

      return listOfReviews;
    });
  }
};
// eslint-disable-next-line import/prefer-default-export
export const resolvers = {
  Query: {
    getUserInfo: (root, args) => data.getUserInfo(args),
    getPaginatedUserReviews: (root, args) => data.getPaginatedUserReviews(args)
  },
  Mutation: {
    createReview: (root, args) => data.createReview(args)
  }
};
