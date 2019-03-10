const { NODE_ENV } = process.env;
export const isStaging = NODE_ENV === "staging";
export const isProd = NODE_ENV === "prod";
