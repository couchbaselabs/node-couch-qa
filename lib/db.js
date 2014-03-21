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

var commandWithConnection = function (cmd) {
  return function () {
    var args = [].slice.call(arguments, 0)
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
  remove: commandWithConnection("remove"),
  get: commandWithConnection("get"),
  conn: conn
}
