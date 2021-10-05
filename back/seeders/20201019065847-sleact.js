"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    // workspaces: 회사
    await queryInterface.bulkInsert("workspaces", [
      {
        id: 1,
        name: "Sleact",
        url: "sleact",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    // channels: 부서
    await queryInterface.bulkInsert("channels", [
      {
        id: 1,
        name: "일반",
        private: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        WorkspaceId: 1,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
