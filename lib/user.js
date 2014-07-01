var db = require("./db")
var bcrypt = require("bcrypt")

function User(credentials) {
  this.username = credentials.username
  this.password = credentials.password
  this.userId = credentials.userId || User.generateId(this.username)
  this.errors = []
}

User.prototype.valid = function () {
  if (this.username && this.password) {
    return true
  } else {
    this.errors.push("Missing username or password")
    return false
  }
}

User.prototype.toJSON = function () {
  return {
    username: this.username,
    hashedPassword: this.hashedPassword
  }
}

User.prototype.populate = function (data) {
  this.username = data.username
  this.hashedPassword = data.hashedPassword
  this.userId = User.generateId(this.username)
}

User.prototype.load = function (cb) {
  var that = this
  db.get(this.userId, function (err, data) {
    if (err) {
      cb(err)
    } else {
      if (typeof data.value === "object") {
        that.populate(data)
      } else {
        that.populate(JSON.parse(data.value))
      }
      cb(null, that)
    }
  })
}

User.prototype.save = function (cb) {
  var that = this
  bcrypt.hash(this.password, 8, function (err, hash) {
    that.hashedPassword = hash
    db.add(that.userId, JSON.stringify(that), function (err, res) {
      if (err) {
        cb(err)
      } else {
        cb(null, that)
      }
    })
  });
}

User.prototype.checkPassword = function (cb) {
  var that = this
  bcrypt.compare(this.password, this.hashedPassword, function(err, res) {
    if (err || !res) {
      cb(new Error("Wrong username or password."))
    } else {
      cb(null, that)
    }
  })
}

User.authenticate = function (credentials, cb) {
  var user = new User(credentials)
  user.load(function (err, user) {
    if (err) {
      cb(new Error("Wrong username or password."))
    } else {
      user.checkPassword(cb)
    }
  })
}

User.validateId = function (userId, cb) {
  var user = new User({ userId: userId })
  user.load(cb)
}

User.create = function (credentials, cb) {
  var user = new User(credentials)
  if (user.valid()) {
    user.save(cb)
  } else {
    cb(user.errors)
  }
}

User.createFacebookUser = function (credentials, cb) {
  var user = new User({ username: credentials.userId })
  db.set(user.userId, user, function (err, res) {
    if (err) {
      cb(err)
    } else {
      cb(null, user)
    }
  })
}

User.remove = function (userId, cb) {
  db.remove(userId, function (err) {
    if (err && err.code !== 13) {
      // don't catch the No such Key error
      cb(err)
    } else {
      cb()
    }
  })
}

User.generateId = function (username) {
  return "u::" + username
}

module.exports = User
