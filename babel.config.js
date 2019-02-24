module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "8.10"
        }
      }
    ],
    ["@babel/preset-typescript", { isTSX: true, allExtensions: true }]
  ],
  plugins: [
    "import-graphql",
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread"
  ]
};
