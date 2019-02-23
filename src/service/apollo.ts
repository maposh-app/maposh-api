import { ApolloServer } from "apollo-server-lambda";
import { resolvers } from "../resolvers";
import * as colors from "../config/console_colors";
import config from "../config";
import schema from "../data/schema/schema.graphql";

const playgroundConfig = (() => {
  const defaultQuery = "query{ hello }";

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

const server = new ApolloServer({
  resolvers,
  typeDefs: schema,
  ...loggingConfig,
  ...playgroundConfig
});

export default server;
