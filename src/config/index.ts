import { isProd, isStaging } from "./environment";

const {
  GRAPHQL_EXPLORE,
  GRAPHQL_REST,
  GRAPHQL_WS,
  PORT,
  SSL: SSL_ENABLED,
  SSL_CRT,
  SSL_KEY
} = process.env;

const SSL = !!SSL_ENABLED ? SSL_ENABLED.toLowerCase() === "true" : false;

export default {
  GRAPHQL_EXPLORE: GRAPHQL_EXPLORE || GRAPHQL_REST,
  GRAPHQL_REST,
  GRAPHQL_WS,

  isProd,
  isStaging,

  PORT,
  SSL,
  SSL_CRT,
  SSL_KEY
};
