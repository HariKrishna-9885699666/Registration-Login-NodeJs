const Joi = require('@hapi/joi')
const {
  validationCommonErrHandler,
  emailStringValidations
} = require('../commonValidations')
const {
  loggerMessage
} = require('../../logger')

function stringNameValidations(
  regex,
  isRequired
) {
  let schema
  if (isRequired) {
    schema = Joi.string()
      .required()
      .regex(regex)
  } else {
    schema = Joi.string()
      .optional()
      .regex(regex)
      .allow('', null)
  }
  return schema
}

function validateRegister(req, res, next) {
  loggerMessage('start', req);
  const data = req.body
  const isEmailReq = emailStringValidations(true)
  let isNameReq = stringNameValidations(/^[a-zA-Z-'.\s\u00C0-\u017F]*$/, true)

  const schema = {
    firstName: isNameReq.label('First Name').error(validationCommonErrHandler),
    lastName: isNameReq.label('Last Name').error(validationCommonErrHandler),
    email: isEmailReq.label('Email').error(validationCommonErrHandler),
    password: Joi.string().required().min(6).max(10).regex(/^\S*$/).label('Password').error(validationCommonErrHandler)
  }

  Joi.validate(data, schema, (err, value) => {
    if (err) {
      loggerMessage('error', err);
      res.status(422).json({
        message: err.message
      })
    } else {
      next()
    }
  })
}

module.exports = exports = validateRegister