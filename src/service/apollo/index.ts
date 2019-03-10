import { ApolloServer } from "apollo-server-lambda";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  Context
} from "aws-lambda";
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
      name
    }
    getPlaceInfo(placeID:"b8c4087f-b979-47ce-a1b4-9db67704a9ab") {
      city
    }
  }
  # mutation {
  #   addPlace(
  #     placeID: "0"
  #     city: "Nice"
  #   ) {
  #     upvoteCount
  #   }
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
      if (!config.isProd) {
        console.log(colors.error(error));
      }
      return error;
    },
    formatResponse: (response: any) => {
      if (!config.isProd) {
        console.log(colors.info(response));
      }
      return response;
    }
  };
})();

export default async function bootstrap(
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
) {
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
  server.createHandler()(event, context, callback);
}
