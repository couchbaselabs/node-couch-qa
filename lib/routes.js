var db = require("./db")

var routes = function (app) {

  app.get("/", function (req, res) {
    db(function(err, conn) {
      if (!err && conn) {
        res.end("Hello world with couchbase!")
      } else {
        res.end("connection failed")
      }
    })
  })

}

module.exports = routes
