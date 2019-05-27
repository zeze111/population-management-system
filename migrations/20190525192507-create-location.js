'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Locations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      males: {
        type: Sequelize.INTEGER
      },
      females: {
        type: Sequelize.INTEGER
      },
      parentLocation: {
        type: Sequelize.STRING
      },
      parentLocationId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Locations",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Locations');
  }
};
