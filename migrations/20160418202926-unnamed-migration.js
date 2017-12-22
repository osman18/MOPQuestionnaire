'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.createTable('guests', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      QuestionId: Sequelize.INTEGER,
      uuid: Sequelize.STRING,
      ipAddress: Sequelize.STRING,
      firstname: Sequelize.STRING,
      lastname: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.STRING
    });
  },

  down: function (queryInterface, Sequelize) {

    return queryInterface.dropTable('guests');
  }
};
