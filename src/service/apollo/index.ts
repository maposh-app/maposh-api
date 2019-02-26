import { ApolloServer, gql } from "apollo-server-lambda";
import { mergeTypes } from "merge-graphql-schemas";
import { resolvers } from "../../resolvers";
import * as colors from "../../config/console_colors";
import config from "../../config";
import "reflect-metadata";

import placeType from "../../model/types/place.graphql";
import reviewType from "../../model/types/review.graphql";
import userType from "../../model/types/user.graphql";

const playgroundConfig = (() => {
  const defaultQuery = `
  {
    getPaginatedUserReviews(handle: "Murl_Wehner", limit: 3) {
      items {
        review
      }
    }
  }
  `;

  return {
    playground: {
      responses: ["{}"],
      tabs: [
        {
          endpoint: config.GRAPHQL_EXPLORE || "/graphql",
          query: defaultQuery
        }
      ],
      tracing: true
    }
  };
})();

const loggingConfig = (() => {
  return {
    formatError: (error: any) => {
      !config.isProd && console.log(colors.error(error));
      return error;
    },
    formatResponse: (response: any) => {
      !config.isProd && console.log(colors.info(response));
      return response;
    }
  };
})();

const typeDefs = mergeTypes([userType, placeType, reviewType]);

const server = new ApolloServer({
  resolvers,
  typeDefs: gql(typeDefs),
  ...loggingConfig,
  ...playgroundConfig
});

export default server;
