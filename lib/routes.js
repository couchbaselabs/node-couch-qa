var db = require("./db")
var auth = require("./auth")
var User = require("./user")

var routes = function (app) {

  app.get("/signin", function (req, res) {
    res.render("signup")
  })

  app.get("/signout", function (req, res) {
    req.session = null
    res.render("signup")
  })

  app.post("/signin", function (req, res) {
    var credentials = req.body
    var user = User.authenticate(credentials, function (err, user) {
      if (err) {
        res.render("signup", { message: err })
      } else {
        req.session.userId = user.userId
        res.redirect("/")
      }
    })
  })

  app.post("/signup", function (req, res) {
    var credentials = req.body
    var user = User.create(credentials, function (err, user) {
      if (err) {
        res.render("signup", { message: err })
      } else {
        req.session.userId = user.userId
        res.redirect("/")
      }
    })
  })

  app.get("/", auth, function (req, res) {
    res.render("index")
  })

}

module.exports = routes
