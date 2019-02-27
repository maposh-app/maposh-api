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
import { ReviewResolver } from "../../model/resolvers/review.resolver";
import { UserResolver } from "../../model/resolvers/user.resolver";

const playgroundConfig = (() => {
  const defaultQuery = `
  {
    getUserInfo(user_id:"offlineContext_cognitoIdentityId") {
      reviews {
        items{
          review
          review_id
        }
      }
    }
  }
  # mutation {
  #   addReview(
  #     review: "Got an iron shirt and went into the outer space"
  #     place_id: "c3e62739-0cb2-4806-b5b1-03b47342986a"
  #     review_title: "Nice"
  #   ) {
  #     review
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
      resolvers: [UserResolver, ReviewResolver]
    }));
  const schema = (global as any).schema;

  const server = new ApolloServer({
    schema,
    context: {
      user_id: event.requestContext.identity.cognitoIdentityId
    },
    ...loggingConfig,
    ...playgroundConfig
  });
  server.createHandler()(event, context, callback);
}
