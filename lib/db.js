var couchbase = require("couchbase")

var dbConfig = {
  host: process.env.COUCHBASE_HOST,
  bucket: process.env.COUCHBASE_BUCKET
}

var _db = null

var db = function (cb) {
  if (_db) {
    return cb(null, _db)
  }
  _db = new couchbase.Connection(dbConfig, function(err) {
    if (err) {
      return cb(err)
    }
    cb(null, _db)
  })
}

module.exports = db
