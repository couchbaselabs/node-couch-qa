var helper = require("./test_helper")
var assert = require("assert")
var fs = require("fs")
var QuestionList = require("../lib/question_list")

describe("QuestionList", function (){
  var list
  before(function () {
    var path = __dirname + "/../config/default_question_list.json"
    var data = fs.readFileSync(path, {encoding: "utf8"})
    list = JSON.parse(data).questions
    list[0].choices[0].state = true
  })

  afterEach(function (done) {
    QuestionList.resetForUser(helper.user, function (err) {
      done()
    })
  })

  it("returns the default list on empty", function (done){
    QuestionList.forUser(helper.user, function (err, list) {
      assert.ifError(err)
      assert(list.questions[0].text)
      done()
    })
  })

  it("saves the list for a user", function (done) {
    QuestionList.saveForUser(helper.user, list, function (err) {
      assert.ifError(err)
      QuestionList.forUser(helper.user, function (err, list) {
        assert(list.questions[0].choices[0].state)
        done()
      })
    })
  })
})
