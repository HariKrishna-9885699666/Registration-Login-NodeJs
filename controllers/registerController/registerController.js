const _ = require('lodash')
const md5 = require('md5')
const { upsert } = require('../utils')
const models = require('../../models')

class RegisterController {
  constructor(id) {
    this.id = id
  }

  static async isUserExists(email, transaction) {
    const user = await models.User.findOne({
      where: {
        email,
      },
      transaction,
    })
    if (user) {
      throw new Error('USER_ALREADY_FOUND')
    }
    return user
  }

  static async register(payload) {
    let transaction
    try {
      transaction = await models.sequelize.transaction()
      await RegisterController.isUserExists(
        _.get(payload, 'email'),
        transaction
      )

      let reqBody = {
        firstName: _.get(payload, 'firstName'),
        lastName: _.get(payload, 'lastName'),
        email: _.get(payload, 'email'),
        password: md5(_.get(payload, 'password')),
      }

      let registerUser = await upsert('User', reqBody, transaction)
      await transaction.commit()
      delete registerUser.dataValues.password
      return registerUser
    } catch (error) {
      if (transaction) await transaction.rollback()
      throw error
    }
  }
}

module.exports = RegisterController
