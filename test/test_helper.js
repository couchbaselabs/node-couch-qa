process.env.NODE_ENV = "test"
var app = require("../")
var db = require("../lib/db")
// port 3001 for tests to not interfere with a dev server running on 3000
var port = process.env.PORT || 3001

module.exports = helper = {
  host: "http://localhost:" + port,
  credentials: {username:"my_user", password: "my_password"},
  credentials2: {username:"my_other_user", password: "my_other_password"},
  user: null,
  user2: null,
  app: app
}

var User = require("../lib/user")

/*
 * handle bootup of test server
 */
before(function(done) {
  app.listen(port)
  User.create(helper.credentials, function (err, user) {
    User.create(helper.credentials2, function (err, user2) {
      helper.user = user
      helper.user2 = user2
      done()
    })
  })
})

after(function (done) {
  db.flush(done)
})


