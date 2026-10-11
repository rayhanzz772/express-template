'use strict'
const cuid = require('cuid')
const argon2 = require('argon2')

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await argon2.hash('Password123!')
    const role = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE code = 'ADM'`,
      { type: Sequelize.QueryTypes.SELECT }
    )
    if (role.length == 0) {
      throw new Error('No role found for code ADM')
    }
    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: cuid(),
          role_id: role[0].id,
          username: 'superadmin',
          email: 'admin@example.com',
          password: hashedPassword,
          status: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: cuid(),
          role_id: role[0].id,
          username: 'john_doe',
          email: 'john@example.com',
          password: hashedPassword,
          status: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      { ignoreDuplicates: true }
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'users',
      { username: ['superadmin', 'john_doe'] },
      {}
    )
  }
}
