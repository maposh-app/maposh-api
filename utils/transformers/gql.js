const gql = require("graphql-tag");
module.exports = {
  process: src => {
    return `exports.default = ${JSON.stringify(gql(src))};`;
  }
};
