var couchbase = require("couchbase")

var bucketConfig = "COUCHBASE_" + process.env.NODE_ENV.toUpperCase() + "_BUCKET"
var bucket = process.env[bucketConfig]

var dbConfig = {
  host: process.env.COUCHBASE_HOST,
  bucket: bucket
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

var commandWithConnection = function (cmd) {
  return function () {
    var args = [].slice.call(arguments, 0)
    var cb = args.slice(-1)[0] // last element of the args is by convention the callback
    conn(function (err, conn) {
      if (err) {
        return cb(err)
      }

      conn[cmd].apply(conn, args)
    })
  }
}

module.exports = {
  add: commandWithConnection("add"),
  set: commandWithConnection("set"),
  setDesignDoc: commandWithConnection("setDesignDoc"),
  remove: commandWithConnection("remove"),
  get: commandWithConnection("get"),
  shutdown: commandWithConnection("shutdown"),
  flush: commandWithConnection("flush"),
  conn: conn
}
