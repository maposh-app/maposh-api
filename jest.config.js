module.exports = {
  roots: ["<rootDir>/src"],
  testRegex: "(.*\\.test\\.(tsx?|jsx?))$",
  transform: {
    "^.+\\.(graphql|gql)$": "./utils/transformers/gql.js",
    "^.+\\.(js|jsx|ts|tsx)$": "./utils/transformers/jsts.js"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};
