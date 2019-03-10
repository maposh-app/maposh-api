import { graphqlHandler } from "./handler";

it("graphql should be a function", () => {
  expect(typeof graphqlHandler).toBe("function");
});
