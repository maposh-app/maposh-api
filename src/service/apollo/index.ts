import { ApolloServer } from "apollo-server-lambda";
import { APIGatewayProxyEvent } from "aws-lambda";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import config from "../../config";
import * as colors from "../../config/console_colors";
import { PlaceResolver } from "../../model/resolvers/place.resolver";
import { UserResolver } from "../../model/resolvers/user.resolver";

const playgroundConfig = (() => {
  const defaultQuery = `
  {
    getUserInfo(userID:"offlineContext_cognitoIdentityId") {
      firstName
      lastName
    }
    getPlaceInfo(placeID:"0") {
      upvoteCount
      city
    }
  }
  # mutation {
  #   like(
  #     placeID: "0"
  #     city: "Nice",
  #     name: "The Nicest Cafe in the World",
  #     longitude: 0.0,
  #     latitude: 0.0
  #   )
  #   dislike(
  #     placeID: "1"
  #     city: "Moscow",
  #     name: "Not The Nicest Cafe in the World"
  #     longitude: 0.0,
  #     latitude: 0.0
  #   )
  # }
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
      if (!config.isProd && !config.isStaging) {
        console.log(colors.error(error));
      }
      return error;
    },
    formatResponse: (response: any) => {
      if (!config.isProd && !config.isStaging) {
        console.log(colors.info(response));
      }
      return response;
    }
  };
})();

export default async function bootstrapHandler(event: APIGatewayProxyEvent) {
  (global as any).schema =
    (global as any).schema ||
    (await buildSchema({
      resolvers: [UserResolver, PlaceResolver]
    }));
  const schema = (global as any).schema;

  const server = new ApolloServer({
    schema,
    context: {
      userID: event.requestContext.identity.cognitoIdentityId
    },
    ...loggingConfig,
    ...playgroundConfig
  });
  return server.createHandler({
    cors: {
      // origin: ["https://maposh.com", "https://staging.maposh.com"],
      origin: "*",
      credentials: true
    }
  });
}
