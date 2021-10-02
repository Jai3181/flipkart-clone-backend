const express = require("express")
const router = express.Router()
const { signup, signin, requireSignin } = require("../controller/auth")
const { validateSignuprequest, isRequestvalidated, validateSigninrequest } = require("../validators/auth")


router.post('/signup', validateSignuprequest, isRequestvalidated, signup)
router.post('/signin', validateSigninrequest, isRequestvalidated, signin)

router.post('/profile', requireSignin, (req, res) => {
  res.status(200).json({ user: "profile" })
})

module.exports = router;