const _ = require('lodash')
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const models = require('../../models')

const jwtKey = process.env.JWT_SECRET
const jwtExpirySeconds = process.env.JWT_EXPIRY_SECONDS

class LoginController {
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
    if (!user) {
      throw new Error('USER_NOT_FOUND')
    }
    return user
  }

  static async loginCheck(obj, transaction) {
    const user = await models.User.findOne({
      where: {
        email: obj.email,
        password: obj.password,
      },
      transaction,
    })
    if (!user) {
      throw new Error('INVALID_USER_PWD')
    }
    return user
  }

  static async login(payload) {
    let transaction
    try {
      transaction = await models.sequelize.transaction()
      await LoginController.isUserExists(
        _.get(payload, 'username'),
        transaction
      )

      let reqBody = {
        email: _.get(payload, 'username'),
        password: md5(_.get(payload, 'password')),
      }

      const userInfo = await LoginController.loginCheck(reqBody, transaction)

      const email = reqBody.email
      const token = jwt.sign({ email }, jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpirySeconds,
      })

      return {
        success: true,
        data: {
          message: 'Login Successful',
          email,
          token,
          name: `${userInfo.firstName} ${userInfo.lastName}`,
        },
      }
    } catch (error) {
      if (transaction) await transaction.rollback()
      throw error
    }
  }
}

module.exports = LoginController
