import {
  Context,
  APIGatewayProxyEvent,
  Callback,
  APIGatewayProxyResult
} from "aws-lambda";
import bootstrap from "./service/apollo";

export function graphql(
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
) {
  bootstrap(event, context, callback);
}
