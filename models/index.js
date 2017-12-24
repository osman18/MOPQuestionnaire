'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};

/*if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);*/

if (process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use db mysql
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'mysql',
    protocol: 'mysql',
    host:     'eu-cdbr-west-01.cleardb.com',
    user:     'b9aa5643e9bf36',
    password: 'b9ed96e9', 
    database: 'heroku_ec0bfe9b1ae1583'
  })
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;