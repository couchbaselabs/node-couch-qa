var db = require("./db")
var auth = require("./auth")
var User = require("./user")
var QuestionList = require("./question_list")

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

  app.get("/questions", auth, function (req, res) {
    res.set("Content-Type", "application/json")
    QuestionList.forUser(req.user, function (err, list) {
      res.end(JSON.stringify(list))
    })
  })

  app.post("/questions", auth, function (req, res) {
    var questions = req.body
    QuestionList.saveForUser(req.user, questions, function (err) {
      if (err) {
        res.statusCode = 500
        res.end()
      } else {
        res.end("OK")
      }
    })
  })

  app.get("/", auth, function (req, res) {
    res.render("index")
  })

}

module.exports = routes
