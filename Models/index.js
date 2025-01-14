"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../DbConfig/DbConfig.json")[env];
const db = {};
let sequelize;

if (process.env.DB_HOST) {
    sequelize = new Sequelize(
      process.env.MYSQLDB_DATABASE,
      process.env.MYSQLDB_USER,
      process.env.MYSQLDB_ROOT_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false,
      }
    );
  } else if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, {
      ...config,
    });
  }
  
  fs.readdirSync(__dirname)
    .filter((file) => {
      return (
        file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
      );
    })
    .forEach((file) => {
      const modelFun = require(path.join(__dirname, file));
      const model = modelFun(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });
  
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
  
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  
  module.exports = db;
  