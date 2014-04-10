var db = require("./db")
var auth = require("./auth")
var User = require("./user")
var facebook = require("./facebook")
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
    User.authenticate(credentials, function (err, user) {
      if (err) {
        res.render("signup", { message: err })
      } else {
        req.session.userId = user.userId
        res.redirect("/")
      }
    })
  })

  app.post("/signin-facebook", function (req, res) {
    var credentials = req.body
    facebook.validateUser(credentials.fbId, credentials.fbToken, function (err, user) {
      if (err) {
        res.end(JSON.stringify({ error: err.message }))
      } else {
        User.createFacebookUser(user, function (err, user) {
          if (err) {
            res.end(JSON.stringify({ error: err.message }))
          } else {
            req.session.userId = user.userId
            res.end(JSON.stringify({ result: "OK", redirect: "/" }))
          }
        })
      }
    })
  })

  app.post("/signup", function (req, res) {
    var credentials = req.body
    User.create(credentials, function (err, user) {
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
      if (err) {
        res.statusCode = 500
        res.end()
      } else {
        res.end(JSON.stringify(list))
      }
    })
  })

  app.post("/questions", auth, function (req, res) {
    var questions = req.body
    QuestionList.saveForUser(req.user, questions, function (err) {
      if (err) {
        res.statusCode = 500
        return res.end()
      } else {
        QuestionList.forUser(req.user, function (err, list) {
          if (err) {
            res.statusCode = 500
            res.end()
          } else {
            res.end(JSON.stringify(list))
          }
        })
      }
    })
  })

  app.get("/", auth, function (req, res) {
    res.render("index")
  })

}

module.exports = routes
