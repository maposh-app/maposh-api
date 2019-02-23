import dynamodb from "serverless-dynamodb-client";

let docClient;

if (process.env.NODE_ENV === "production") {
  const AWSXRay = require("aws-xray-sdk"); // eslint-disable-line global-require
  const AWS = AWSXRay.captureAWS(require("aws-sdk")); // eslint-disable-line global-require
  docClient = new AWS.DynamoDB.DocumentClient();
} else {
  docClient = dynamodb.doc;
}

// add to handler.js
const promisify = foo =>
  new Promise((resolve, reject) => {
    foo((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

const data = {
  getPaginatedUserReviews(handle, args) {
    return promisify(callback => {
      const params = {
        TableName: "Reviews",
        KeyConditionExpression: "handle = :v1",
        ExpressionAttributeValues: {
          ":v1": handle
        },
        IndexName: "top-user-reviews",
        Limit: args.limit,
        ScanIndexForward: false
      };

      if (args.nextToken) {
        params.ExclusiveStartKey = {
          review_id: args.nextToken.review_id,
          place_id: args.nextToken.place_id,
          created_at: args.nextToken.created_at,
          handle: handle
        };
      }

      docClient.query(params, callback);
    }).then(result => {
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
          place_id: result.Items[i].place_id,
          created_at: result.LastEvaluatedKey.created_at,
          handle: result.LastEvaluatedKey.handle
        };
      }

      return listOfReviews;
    });
  },

  getPaginatedPlaceReviews(place_id, args) {
    return promisify(callback => {
      const params = {
        TableName: "Reviews",
        KeyConditionExpression: "place_id = :v1",
        ExpressionAttributeValues: {
          ":v1": place_id
        },
        IndexName: "place-reviews",
        Limit: args.limit,
        ScanIndexForward: false
      };

      if (args.nextToken) {
        params.ExclusiveStartKey = {
          review_id: args.nextToken.review_id,
          place_id: args.nextToken.place_id,
          created_at: args.nextToken.created_at,
          place_id: place_id
        };
      }

      docClient.query(params, callback);
    }).then(result => {
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
          place_id: result.Items[i].place_id,
          created_at: result.LastEvaluatedKey.created_at,
          handle: result.LastEvaluatedKey.handle
        };
      }

      return listOfReviews;
    });
  },

  getUserInfo(args) {
    return promisify(callback =>
      docClient.query(
        {
          TableName: "Users",
          KeyConditionExpression: "handle = :v1",
          ExpressionAttributeValues: {
            ":v1": args.handle
          }
        },
        callback
      )
    ).then(result => {
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
    getUserInfo: (root, args) => data.getUserInfo(args)
  },
  Mutation: {
    createReview: (root, args) => data.createReview(args)
  },
  User: {
    reviews: (obj, args) => data.getPaginatedUserReviews(obj.handle, args)
  },
  Place: {
    reviews: (obj, args) => data.getPaginatedPlaceReviews(obj.place_id, args)
  }
};
