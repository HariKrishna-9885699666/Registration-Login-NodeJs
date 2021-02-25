const router = require('express').Router()

const registerValidation = require('../../lib/validations').register

const registerHandler = require('./registerHandler')

router.post('', registerValidation, registerHandler)

module.exports = exports = router