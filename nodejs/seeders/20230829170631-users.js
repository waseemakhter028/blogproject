/* eslint-disable no-unused-vars */
'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'john',
          email: 'john@gmail.com',
          city: 'DP',
          age: 22,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'seth',
          email: 'seth@gmail.com',
          city: 'MP',
          age: 25,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'roman',
          email: 'roman@gmail.com',
          city: 'HP',
          age: 28,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'deen',
          email: 'deen@gmail.com',
          city: 'JP',
          age: 30,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'miz',
          email: 'miz@gmail.com',
          city: 'UP',
          age: 29,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {
      truncate: true
    })
  }
}
