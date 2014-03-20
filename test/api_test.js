var helper = require("./test_helper")
var assert = require("assert")
var request = require("request")
var User = require("../lib/user")

describe("API", function(){
  var ephemeralUser = {username:"a_user", password: "a_password"}
  afterEach(function (done) {
    User.remove(User.generateId(ephemeralUser.username), done) // cleanup
  })

  it("handles signup", function(done){
    request.post(helper.host + "/signup", {form: ephemeralUser}, function (err, res, body) {
      assert.equal(res.statusCode, 302) // redirect after signup
      done()
    })
  })

  it("handles signin", function(done){
    request.post(helper.host + "/signin", {form: helper.credentials}, function (err, res, body) {
      assert.equal(res.statusCode, 302) // redirect after signin
      done()
    })
  })
})
