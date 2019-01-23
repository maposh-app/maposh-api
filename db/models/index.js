"use strict";

const Sequelize = require("sequelize");

const config = require("../config/config");

const User = require("./user");
const Review = require("./review");
const Place = require("./place");

const db = {};

let sequelize;

sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const modelModules = [User, Review, Place];

modelModules.forEach(modelModule => {
  const model = modelModule(sequelize, Sequelize);
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
