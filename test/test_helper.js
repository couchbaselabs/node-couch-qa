process.env.NODE_ENV = "test"
var app = require("../")
// port 3001 for tests to not interfere with a dev server running on 3000
var port = process.env.PORT || 3001

module.exports = helper = {
  host: "http://localhost:" + port,
  app: app
}

/*
 * handle bootup of test server
 */
before(function() {
  app.listen(port)
})


