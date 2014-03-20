var helper = require("./test_helper")
var assert = require("assert")
var User = require("../lib/user")

describe("User", function (){
  var credentials = { username: "foo", password: "bar" }

  beforeEach(function (done) {
    User.create(credentials, done)
  })

  afterEach(function (done) {
    User.remove(User.generateId(credentials.username), done)
  })

  it("creates a user", function (done){
    User.create({username: "user", password: "password"}, function (err, user) {
      assert.ifError(err)
      assert(user.userId)
      User.remove(User.generateId("user"), done) // cleanup
    })
  })

  it("authenticates a user", function (done) {
    User.authenticate(credentials, function (err, user) {
      assert.ifError(err)
      assert(user.userId)
      done()
    })
  })

  it("does not authenticates a user with wrong password", function (done) {
    var credentials = { username: "foo", password: "wrong_password" }
    User.authenticate(credentials, function (err, user) {
      assert(err)
      done()
    })
  })
})
