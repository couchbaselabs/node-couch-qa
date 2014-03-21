var helper = require("./test_helper")
var assert = require("assert")
var request = require("request")
var User = require("../lib/user")

describe("API", function(){
  var ephemeralUser = {username:"a_user", password: "a_password"}
  afterEach(function (done) {
    User.remove(User.generateId(ephemeralUser.username), done) // cleanup
  })

  it("handles signup", function (done){
    request.post(helper.host + "/signup", {form: ephemeralUser}, function (err, res, body) {
      assert.equal(res.statusCode, 302) // redirect after signup
      done()
    })
  })

  it("handles signin", function (done){
    request.post(helper.host + "/signin", {form: helper.credentials}, function (err, res, body) {
      assert.equal(res.statusCode, 302) // redirect after signin
      done()
    })
  })

  describe("questions", function () {
    var req
    var list
    beforeEach(function (done) {
      var j = request.jar()
      req = request.defaults({jar:j})

      req.post(helper.host + "/signin", {form: helper.credentials}, function (err, res, body){
        req.get(helper.host + "/questions", function(err, res, body) {
          list = JSON.parse(body)
          done()
        })
      })
    })

    it("saves the questions", function (done) {
      list.questions[0].choices[0].state = true
      req.post(helper.host + "/questions", {json: list}, function (err, res, body) {
        assert.equal(res.statusCode, 200)
        req.get(helper.host + "/questions", function(err, res, body) {
          body = JSON.parse(body)
          assert(body.questions[0].choices[0].state)
          done()
        })
      })
    })
  })
})
