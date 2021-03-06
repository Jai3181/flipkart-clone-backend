const User = require("../../models/user")
const jwt = require("jsonwebtoken")

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email })
    .exec((error, user) => {
      if (user) return res.status(400).json({
        message: "admin already exists"
      })

      const { firstName, lastName, email, password } = req.body;
      const _user = new User({
        firstName,
        lastName,
        email,
        password,
        username: Math.random().toString(),
        role: "admin"
      })

      _user.save((error, data) => {
        if (error) {
          return res.status(400).json({
            message: "something went wrong while adding admin"
          })
        }
        if (data) {
          return res.status(201).json({
            message: "admin Created"
          })
        }
      })
    })
}

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email })
    .exec((error, user) => {
      if (error) {
        res.status(400).json({ error })
      }
      if (user) {
        if (user.authenticate(req.body.password) && user.role === "admin") {
          const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "4h" });
          const { _id, firstName, lastName, email, role, fullName } = user
          res.status(200).json({
            token,
            user: {
              _id, firstName, lastName, email, role, fullName
            }
          })
        }
        else {
          res.status(400).json({
            message: "invalid password"
          })
        }
      }
      else {
        res.status(400).json({
          message: "something went wrong"
        })
      }
    })
}