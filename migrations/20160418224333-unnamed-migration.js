'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.createTable('admin', {
      username: Sequelize.STRING,
      password: Sequelize.STRING
    });
  },

  down: function (queryInterface, Sequelize) {

    return queryInterface.dropTable('admin');
  }
};
