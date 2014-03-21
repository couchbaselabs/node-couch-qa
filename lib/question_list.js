var db = require("./db")
var fs = require("fs")

var _list = null
var defaultList = function () {
  if (!_list) {
    var path = __dirname + "/../config/default_question_list.json"
    var data = fs.readFileSync(path, {encoding: "utf8"})
    _list = JSON.parse(data).questions
  }
  return _list
}

QuestionList.generateId = function (user) {
  return "ql::" + user.userId
}

function QuestionList(user, questions, cas) {
  this.cas = cas
  this.key = QuestionList.generateId(user)
  if (questions && Object.keys(questions).length > 0) {
    this.questions = questions
  } else {
    this.questions = defaultList()
  }
}

QuestionList.prototype.toJSON = function () {
  return this.questions
}

QuestionList.prototype.load = function (cb) {
  var that = this
  db.get(this.key, function (err, data) {
    if (err && err.code !== 13) {
      return cb(err)
    }

    if (err && err.code === 13) {
      // save the initial question list
      return that.save(function (err, data) {
        that.cas = data.cas
        cb(null, that)
      })
    }

    that.questions = data.value
    that.cas = data.cas
    cb(null, that)
  })
}

QuestionList.prototype.save = function (cb) {
  var options = {}
  if (this.cas) {
    options.cas = this.cas
  }
  db.set(this.key, this, options, cb)
}

QuestionList.forUser = function (user, cb) {
  var questionList = new QuestionList(user)
  questionList.load(cb)
}

QuestionList.resetForUser = function (user, cb) {
  db.remove(QuestionList.generateId(user), cb)
}

QuestionList.saveForUser = function (user, data, cb) {
  var questionList = new QuestionList(user, data.questions, data.cas)
  questionList.save(cb)
}

module.exports = QuestionList

