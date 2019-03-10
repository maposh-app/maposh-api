import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  Context
} from "aws-lambda";
import bootstrapHandler from "./service/apollo";

export const graphqlHandler = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
) => {
  bootstrapHandler(event).then(handler => handler(event, context, callback));
};
