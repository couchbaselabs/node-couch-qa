var defaultList = [
  { text: "What is couchbases upcoming query language called?",
    choices: [
      {text: "N1QL", state: false, count: 0},
      {text: "SQL", state: false, count: 0},
      {text: "CQL", state: false, count: 0},
      {text: "NoSQL", state: false, count: 0}
    ]
  }
]

function QuestionList(user) {
  this.key = "ql::" + user.userId
  this.questions = defaultList
}

QuestionList.prototype.toJSON = function () {
  return this.questions
}

QuestionList.prototype.load = function (cb) {
  cb(null, this)
}

QuestionList.forUser = function (user, cb) {
  questionList = new QuestionList(user)
  questionList.load(cb)
}

module.exports = QuestionList

