process.env.NODE_ENV = "test"
var app = require("../")
// port 3001 for tests to not interfere with a dev server running on 3000
var port = process.env.PORT || 3001

module.exports = helper = {
  host: "http://localhost:" + port,
  credentials: {username:"my_user", password: "my_password"},
  user: null,
  app: app
}

var User = require("../lib/user")

/*
 * handle bootup of test server
 */
before(function(done) {
  app.listen(port)
  User.create(helper.credentials, function (err, user) {
    helper.user = user
    done()
  })
})

after(function (done) {
  User.remove(User.generateId(helper.credentials.username), done)
})


