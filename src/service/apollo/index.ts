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
import { UserResolver } from "../../model/resolvers/user.resolver";

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
      resolvers: [UserResolver]
    }));
  const schema = (global as any).schema;

  const server = new ApolloServer({
    schema,
    ...loggingConfig,
    ...playgroundConfig
  });
  server.createHandler()(event, context, callback);
}
