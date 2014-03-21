var helper = require("./test_helper")
var fs = require("fs")
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
    before(function (done) {
      var j = request.jar()
      req = request.defaults({jar:j})

      var path = __dirname + "/../config/default_question_list.json"
      var data = fs.readFileSync(path, {encoding: "utf8"})
      list = JSON.parse(data)
      list.questions[0].choices[0].state = true

      req.post(helper.host + "/signin", {form: helper.credentials}, done)
    })

    it("loads questions", function (done) {
      req.get(helper.host + "/questions", function(err, res, body) {
        body = JSON.parse(body)
        assert(body[0].text)
        done()
      })
    })

    it("saves the questions", function (done) {
      req.post(helper.host + "/questions", {json: list.questions}, function (err, res, body) {
        assert.equal(res.statusCode, 200)
        req.get(helper.host + "/questions", function(err, res, body) {
          body = JSON.parse(body)
          assert(body[0].choices[0].state)
          done()
        })
      })
    })
  })
})
