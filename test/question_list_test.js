var helper = require("./test_helper")
var assert = require("assert")
var QuestionList = require("../lib/question_list")

describe("QuestionList", function (){
  var list
  beforeEach(function (done) {
    QuestionList.forUser(helper.user, function (err, loaded) {
      list = loaded
      list.questions[0].choices[0].state = true
      done()
    })
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

  it("disallows overwrite without cas", function (done) {
    QuestionList.forUser(helper.user, function (err, list1) {
      QuestionList.forUser(helper.user, function (err, list2) {
        list1.questions[0].choices[0].state = true
        list2.questions[0].choices[1].state = true
        QuestionList.saveForUser(helper.user, list1, function (err) {
          assert.ifError(err)
          QuestionList.saveForUser(helper.user, list2, function (err) {
            assert(err)
            done()
          })
        })
      })
    })
  })
})
