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

function QuestionList(user, state) {
  this.key = QuestionList.generateId(user)
  if (state && Object.keys(state).length > 0) {
    this.questions = state
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
    if (err) {
      if (err.code === 13) {
        // nothing saved yet return default list
        cb(null, that)
      } else {
        cb(err)
      }
    } else {
      that.questions = data.value
      that.loadCounts(cb)
    }
  })
}

var choicesKeys = [
  ["1", "a"],
  ["1", "b"],
  ["1", "c"],
  ["1", "d"],
  ["2", "a"],
  ["2", "b"],
  ["2", "c"]
]

QuestionList.prototype.loadCounts = function (cb) {
  var that = this
  db.conn(function (err, conn) {
    var opts = {stale: false, group: true, keys: choicesKeys}
    var q = conn.view("ncqa", "counts", opts)
    q.query(function (err, results) {
      choicesKeys.forEach(function (key) {
        var result = results.filter(function (e) {
          if (e.key[0] === key[0] && e.key[1] === key[1]) {
            return true
          }
        })
        if (result.length === 0) return

        var question = that.questions.filter(function (e) {
          if (e.id === key[0]) {
            return true
          }
        })

        var choice = question[0].choices.filter(function (e) {
          if (e.id === key[1]) {
            return true
          }
        })

        choice[0].count = result[0].value
      })
      cb(null, that)
    })
  })
}

QuestionList.prototype.save = function (cb) {
  db.set(this.key, this, cb)
}

QuestionList.forUser = function (user, cb) {
  var questionList = new QuestionList(user)
  questionList.load(cb)
}

QuestionList.resetForUser = function (user, cb) {
  db.remove(QuestionList.generateId(user), cb)
}

QuestionList.saveForUser = function (user, questions, cb) {
  var questionList = new QuestionList(user, questions)
  questionList.save(cb)
}

module.exports = QuestionList

