const router = require('express').Router()


// Handlers initialization
const logInHandler = require('./LogIn')
const registerHandler = require('./Register')


router.use('/login', logInHandler)
router.use('/register', registerHandler)


module.exports = exports = router