var couchbase = require("couchbase")

var dbConfig = {
  host: process.env.COUCHBASE_HOST,
  bucket: process.env.COUCHBASE_BUCKET
}

var _db = null

var conn = function (cb) {
  if (_db) {
    return cb(null, _db)
  }
  _db = new couchbase.Connection(dbConfig, function(err) {
    if (err) {
      cb(err)
    } else {
      cb(null, _db)
    }
  })
}

var oneArgCommands = ["remove", "get"]
var twoArgCommands = ["add"]

var commandWithConnection = function (cmd) {
  if (oneArgCommands.indexOf(cmd) !== -1) {
    return function (key, cb) {
      conn(function (err, conn) {
        if (err) {
          cb(err)
        } else {
          conn[cmd](key, cb)
        }
      })
    }
  } else if (twoArgCommands.indexOf(cmd) !== -1) {
    return function (key, value, cb) {
      conn(function (err, conn) {
        if (err) {
          cb(err)
        } else {
          conn[cmd](key, value, cb)
        }
      })
    }
  }
}

module.exports = {
  add: commandWithConnection("add"),
  remove: commandWithConnection("remove"),
  get: commandWithConnection("get"),
  conn: conn
}
