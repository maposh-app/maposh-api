import graphqlServer from "./service/apollo";

export const graphqlHandler = graphqlServer.createHandler({
  cors: {
    origin: "*"
  }
});
