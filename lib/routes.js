var db = require("./db")
var auth = require("./auth")
var User = require("./user")

var routes = function (app) {

  app.get("/signin", function (req, res) {
    res.render("signup")
  })

  app.get("/signout", function (req, res) {
    req.session = null
  })

  app.post("/signin", function (req, res) {
    var credentials = req.body
    var user = User.create(credentials)
    if (user) {
      req.session.userId = user.id
      res.redirect("/")
    } else {
      res.render("signup", { message: "failed to create the user" })
    }
  })

  app.post("/signup", function (req, res) {
  })

  app.get("/", auth, function (req, res) {
    db(function(err, conn) {
      if (!err && conn) {
        res.render("index", { message: "Hello world with couchbase!" })
      } else {
        res.render("index", { message: "Connection failed!" })
      }
    })
  })

}

module.exports = routes
