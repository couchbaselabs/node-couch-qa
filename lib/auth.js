var User = require("./user")


var auth = function (req, res, next) {
  if (req.session.userId) {
    User.validateId(req.session.userId, function (err, user) {
      if (err) {
        res.redirect("/signin")
      } else {
        next()
      }
    })
  } else {
    res.redirect("/signin")
  }
}

module.exports = auth
